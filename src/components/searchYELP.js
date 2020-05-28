import React, { Component } from 'react';

import withStyles from '@material-ui/core/styles/withStyles';

import { IconButton, TextField, Grid, Typography, Dialog } from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';

import { authMiddleWare } from '../util/auth';
import axios from 'axios';

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
	}
});

class searchYELP extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchOpen: false,
			bizName: '',
			bizLocation: this.props.location,
			bizCategory: this.props.cat,
			bizData: '',
			errors: []
		};
	}

	handleChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value
		});
	};

	render() {
		const { searchOpen, errors } = this.state;
		const {classes} = this.props;

		const handleOnClick = (e) => {
			e.preventDefault();
			console.log('search clicked');
			// authMiddleWare(this.props.history);
			// const authToken = localStorage.getItem('AuthToken');
			// axios.defaults.headers.common = { Authorization: `${authToken}`};

			// axios 
			// 	.get('/biz')
			// 	.then((res) => {
			// 		this.setState({
			// 			bizData: res.data 
			// 		});
			// 	})
			// 	.catch((err) => {
			// 		console.log(err);
			// 		this.setState({
			// 			errors: err.response.data
			// 		})
			// 	});
		};
		// const DialogTitle = withStyles(styles)((props) => {
		// 	const { children, classes, onClose, ...other } = props;
		// 	return (
		// 		<MuiDialogTitle disableTypography className={classes.root} {...other}>
		// 			<Typography variant="h6">{children}</Typography>
		// 			{onClose ? (
		// 				<IconButton aria-label="close" className={classes.closeButton} onClick={onClose}><CloseIcon /></IconButton>
		// 			) : null}
		// 		</MuiDialogTitle>
		// 	);
		// });

		// const DialogContent = withStyles((theme) => ({
		// 	viewRoot: {
		// 		padding: theme.spacing(2)
		// 	}
		// }))(MuiDialogContent);

		const handleSearch = (e) => {
			e.preventDefault();
			
			authMiddleWare(this.props.history);
			const authToken = localStorage.getItem('AuthToken');
			axios.defaults.headers.common = { Authorization: `${authToken}`};

			axios 
				.get('/biz')
				.then((res) => {
					console.log(res.data);
				})
				.catch((err) => {
					console.log(err);
				});
		};

		const handleClose = () => {
			this.setState({
				searchOpen: false,
				bizName: '',
				bizLocation: ''
			});
		};

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

				<Dialog open={searchOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
					<DialogTitle id="dialog-title" onClose={handleClose}>{this.state.cat}</DialogTitle>
					{/* <form noValidate>
						<Grid item xs={12} md={5}>
							<TextField 
								name="bizName" 
								value={this.state.bizName} 
								id="bizName"
								label="Eatery"
								onChange={this.handleChange}
								helperText={errors.bizName}
								error={errors.bizName ? true : false}
							/>
						</Grid>
						<Grid item xs={12} md={5}>
							<TextField 
								name="bizLocation" 
								value={this.state.bizLocation} 
								id="bizLocation"
								label="Where"
								helperText={errors.bizLocation}
								onChange={this.handleChange}
								error={errors.bizLocation ? true : false}
							/>
						</Grid>
						<Grid item xs={12} md={2}>
							<Button color="primary" onClick={handleOnClick}>Search</Button>
						</Grid>
					</form> */}
				</Dialog>
			</main>
		);
	}
};

export default withStyles(styles)(searchYELP);