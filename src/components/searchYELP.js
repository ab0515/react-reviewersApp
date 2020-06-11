import React, { useState, useEffect } from 'react';

import withStyles from '@material-ui/core/styles/withStyles';

import { IconButton, Typography, Dialog, CardActionArea } from '@material-ui/core';
import { Card, CardContent } from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';

import { authMiddleWare } from '../util/auth';
import axios from 'axios';
import { yelpApiKEY } from '../util/configYELP';

const styles = (theme) => ({
	root: {
		minWidth: 470
	},
	closeButton: {
		position: 'absolute',
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500]
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
	},
	cards: {
		margin: theme.spacing(1)
	}
});

const SearchYELP = (props) => {
	const {classes} = props;
	const [inputs, setInputs] = useState({});
	const [searchOpen, setSearchOpen] = useState(props.searchOpen);
	const [bizName, setBizName] = useState('');
	const [restaurants, setRestaurants] = useState([]);
	const [errors, setErrors] = useState([]);

	useEffect(() => {
		setInputs({
			location: props.location,
			category: props.cat
		});
	}, [props.location, props.cat]);

	const handleSearch = (e) => {
		e.preventDefault();
		authMiddleWare(props.history);

		// const authToken = localStorage.getItem('AuthToken');
		axios.defaults.headers.common = { Authorization: `Bearer ${yelpApiKEY}`};
		axios
			.get(`/search?term=${inputs.category}&location=${inputs.location}&sort-by=best_match`)
			.then((res) => {
				setRestaurants(res.data.businesses);
				setSearchOpen(true);
			})
			.catch(err => {
				console.log(err);
				setErrors(err.response.text);
			});
	};

	const handleClose = () => {
		setSearchOpen(false);
	};

	const handleClick = (name) => {
		props.handleName(name);
		setSearchOpen(false);
	}

	const DialogTitle = withStyles(styles)((props) => {
		const { children, classes, onClose, ...other } = props;
		return (
			<MuiDialogTitle disableTypography className={classes.root} {...other}>
				<Typography variant="h6">{children}</Typography>
				{onClose ? (
					<IconButton aria-label="close" className={classes.closeButton} onClick={onClose}><CloseIcon /></IconButton>
				) : null}
			</MuiDialogTitle>
		);
	});

	const DialogContent = withStyles((theme) => ({
		viewRoot: {
			padding: theme.spacing(2)
		}
	}))(MuiDialogContent);

	return (
		<main className={classes.content}>
			<IconButton aria-label="search" onClick={handleSearch}><SearchIcon /></IconButton>

			<Dialog open={searchOpen} 
					onClose={handleClose} 
					aria-labelledby="form-dialog-title"
					scroll="paper"
			>
				<DialogTitle id="dialog-title" onClose={handleClose}>Restaurants</DialogTitle>
				<DialogContent dividers="paper">
					{
						restaurants.map(rest => 
							<Card key={rest.id} className={classes.cards}>
								<CardActionArea onClick={() => handleClick(rest.name)}>
									<CardContent>
										<Typography variant="subtitle1">{rest.name}</Typography>
										<Typography variant="body1">{rest.rating} | {rest.price}</Typography>
									</CardContent>
								</CardActionArea>
							</Card>
						)
					}
				</DialogContent>
			</Dialog>
		</main>
	);
};

export default withStyles(styles)(SearchYELP);