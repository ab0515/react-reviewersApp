import React, { Component } from 'react'

import withStyles from '@material-ui/core/styles/withStyles';

import { Button, Dialog, Box, AppBar, Toolbar } from '@material-ui/core';
import { IconButton, Slide, TextField, InputAdornment } from '@material-ui/core';
import { Grid, Card, CardActions, CardContent } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import {Rating, Autocomplete} from '@material-ui/lab';

import AddCircleIcon from '@material-ui/icons/AddCircle';
import CloseIcon from '@material-ui/icons/Close';
import LocationOnIcon from '@material-ui/icons/LocationOn';

import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { authMiddleWare } from '../util/auth';
import { Typography, CardHeader } from '@material-ui/core';
import SearchYELP from './SearchYELP';

const styles = (theme) => ({
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1
	},
	toolbar: theme.mixins.toolbar,
	title: {
		marginLeft: theme.spacing(2),
		flex: 1,
		fontWeight: 'bold'
	},
	submitButton: {
		display: 'block',
		color: 'white',
		textAlign: 'center',
		position: 'absolute',
		top: 14,
		right: 10
	},
	floatingButton: {
		position: 'fixed',
		bottom: 0,
		right: 0
	},
	form: {
		width: '98%',
		marginLeft: 13,
		marginTop: theme.spacing(10)
	},
	root: {
		minWidth: 470
	},
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)'
	},
	pos: {
		fontSize: '14px'
	},
	time: {
		fontSize: '12px'
	},
	uiProgress: {
		position: 'fixed',
		zIndex: '1000',
		height: '31px',
		width: '31px',
		left: '50%',
		top: '35%'
	},
	dialogeStyle: {
		maxWidth: '50%'
	},
	viewRoot: {
		margin: 0,
		padding: theme.spacing(2)
	},
	closeButton: {
		position: 'absolute',
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500]
	},
	rateAlign: {
		verticalAlign: 'textBottom'
	},
	body: {
		paddingRight: theme.spacing(4),
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2)
	},
});

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

class todo extends Component {
	constructor(props) {
		super(props);

		this.state = {
			reviews: '',
			uiLoading: true,
			title: '',
			body: '',
			todoId: '',
			location: '',
			username: '',
			rate: 0,
			errors: [],
			open: false,
			buttonType: '',
			viewOpen: false,
			categories: '',
			category: ''
		};
		this.deleteTodoHandler = this.deleteTodoHandler.bind(this);
		this.handleEditClickOpen = this.handleEditClickOpen.bind(this);
		this.handleViewOpen = this.handleViewOpen.bind(this);
		this.handleRestName = this.handleRestName.bind(this);
	}

	requestTodos = () => axios.get('/api/todos');
	requestCategories = () => axios.get('/api/categories');

	handleChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value
		});
	};

	async componentDidMount() {
		authMiddleWare(this.props.history);
		const authToken = localStorage.getItem('AuthToken');
		axios.defaults.headers.common = { Authorization: `${authToken}`};
		
		try {
			const [reviewData, catData] = await axios.all([this.requestTodos(), this.requestCategories()]);
			console.log(reviewData.data);
			this.setState({
				reviews: reviewData.data,
				categories: catData.data.map((option) => {
					const firstLetter = option.title[0].toUpperCase();
					return {
						firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
						...option,
					}
				}),
				uiLoading: false
			})
		} catch (err) {
            console.log(err.message);
        }
	};

	deleteTodoHandler(data) {
		authMiddleWare(this.props.history);
		const authToken = localStorage.getItem('AuthToken');
		axios.defaults.headers.common = { Authorization: `${authToken}` };
		let todoId = data.todo.todoId;
		axios 
			.delete(`/api/todo/${todoId}`)
			.then(() => {
				window.location.reload();
			})
			.catch((err) => {
				console.log(err);
			});
	};

	handleEditClickOpen(data) {
		this.setState({
			title: data.todo.title,
			body: data.todo.body,
			todoId: data.todo.todoId,
			rate: data.todo.rate,
			location: data.todo.location,
			buttonType: 'Edit',
			open: true
		});
	};

	handleViewOpen(data) { 
		this.setState({
			title: data.todo.title,
			body: data.todo.body,
			rate: data.todo.rate,
			location: data.todo.location,
			viewOpen: true
		});
	};

	handleRestName(name) {
		this.setState({ title: name });
	};

	render() {
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

		dayjs.extend(relativeTime);
		const { classes } = this.props;
		const { open, errors, viewOpen } = this.state;

		const handleClickOpen = () => {	// create a new post
			this.setState({
				todoId: '',
				title: '',
				body: '',
				location: '',
				category: '',
				rate: 0,
				buttonType: '',
				open: true
			});
		};

		const handleSubmit = (e) => {
			authMiddleWare(this.props.history);
			e.preventDefault();
			const userReview = {
				title: this.state.title,
				body: this.state.body,
				rate: this.state.rate,
				location: this.state.location
			};
			let options = {};
			if (this.state.buttonType === 'Edit') {
				options = {
					url: `/api/todo/${this.state.todoId}`,
					method: 'put',
					data: userReview
				};
			} else {
				options = {
					url: '/api/todo',
					method: 'post',
					data: userReview
				};
			}
			const authToken = localStorage.getItem('AuthToken');
			axios.defaults.headers.common = { Authorization: `${authToken}` }; 
			axios(options) 
				.then(() => {
					this.setState({ open: false });
					window.location.reload();
				})
				.catch((err) => {
					this.setState({ open: true, errors: err.response.data  });
					console.log(err);
				});
		};

		const handleViewClose = () => {
			this.setState({viewOpen:false});
		};

		const handleClose = (e) => {
			this.setState({open: false});
		};

		if (this.state.uiLoading === true) {
			return (
				<main className={classes.content}>
					<div className={classes.toolbar} />
					{this.state.uiLoading && <CircularProgress size={150} className={classes.uiProgress} />}
				</main>
			)
		} else {
			return (
				<main className={classes.content}>
					<div className={classes.toolbar}/>
					<IconButton 
						className={classes.floatingButton}
						color="primary"
						aria-label="Add Todo"
						onClick={handleClickOpen}
						><AddCircleIcon style={{ fontSize: 60}} /></IconButton>
					<Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
						<AppBar className={classes.appBar}>
							<Toolbar>
								<IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close"><CloseIcon /></IconButton>
								<Typography variant="h6" className={classes.title}>
									{this.state.buttonType === 'Edit' ? 'Edit review' : 'Create a new review'}
								</Typography>
								<Button 
									autoFocus
									color="inherit"
									onClick={handleSubmit}
									className={classes.submitButton}
								>
									{this.state.buttonType === 'Edit' ? 'Save' : 'Submit'}
								</Button>
							</Toolbar>
						</AppBar>

						{/* Review Form		 */}
						<form className={classes.form} noValidate>
							<Grid container spacing={3}>
								<Grid item xs={12} md={6}>
									<Autocomplete
										id="cat-autocomplete"
										options={this.state.categories.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
										groupBy={(option) => option.firstLetter}
										getOptionLabel={(option) => option.title}
										value={this.state.category}
										onChange={(e, newValue) => {
											this.setState({
												category: newValue
											});
										}}
										renderInput={(params) => <TextField {...params} label="Categories" variant="outlined" />}
									/>
								</Grid>

								<Grid item xs={12} md={4}>
									<TextField 
										variant="outlined"
										required
										fullWidth 
										id="todoLocation"
										label="Location"
										name="location"
										helperText={errors.location}
										value={this.state.location}
										error={errors.location ? true : false}
										onChange={this.handleChange}
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<LocationOnIcon />
												</InputAdornment>
											),
										}}
									/>
								</Grid>
								<Grid item xs={12} md={2}>
									<SearchYELP location={this.state.location} 
												cat={this.state.category ? this.state.category.title : ""}
												handleName={this.handleRestName}
									/>
									{/* <Button color="primary" onClick={handleTest}>Search</Button> */}
								</Grid>

								<Grid item xs={12} md={6}>
									<TextField
										variant="outlined"
										required
										fullWidth 
										id="todoTitle"
										label="Restaurant Name"
										name="title"
										autoComplete="todoTitle"
										helperText={errors.title}
										value={this.state.title}
										error={errors.title ? true : false}
										onChange={this.handleChange}
										disabled={!this.state.category}
									/>	
								</Grid>

								<Grid item xs={12} md={6}>
									<Box display="flex" flexDirection="row" p={1} borderColor="transparent">
										<Box p={1}><Typography component="legend">Rating:</Typography></Box>
										<Box p={1}><Rating name="simple-rating" 
															value={this.state.rate} 
															onChange={(e, newValue) => {this.setState({ rate: newValue })}} /></Box>
									</Box>
								</Grid>
								<Grid item xs={12}>
									<TextField 
										variant="outlined"
										required
										fullWidth 
										id="todoDetails"
										label="Review (max. 500 words)"
										name="body"
										autoComplete="todoDetails"
										multiline
										rows={20}
										rowsMax={20}
										helperText={errors.body}
										value={this.state.body}
										error={errors.body ? true : false}
										onChange={this.handleChange}
									/>
								</Grid>
							</Grid>
						</form>
					</Dialog>

					{/* Display reviews on dashboard */}
					<Grid container spacing={2}>
						{this.state.reviews.map((todo) => (
							<Grid item xs={12} key={todo.todoId}>
								<Card className={classes.root} variant="outlined">
										<Grid container>
											<Grid item xs={12} md={4}>
													<CardContent>
														<Typography color="textSecondary" className={classes.time}>
															{dayjs(todo.createdAt).fromNow()}
														</Typography>
														<Typography variant="h6" component="h2">{todo.title}</Typography>
														<Typography className={classes.pos} color="textSecondary">
															<LocationOnIcon style={{verticalAlign:'bottom'}} />{todo.location} | <Rating name="rate" className={classes.rateAlign} value={todo.rate} precision={0.5} size="small" readOnly />
														</Typography>
														<Typography variant="body1">{todo.writtenBy}</Typography>
												</CardContent>
												<CardActions>
													<Button size="small" color="primary" onClick={() => this.handleViewOpen({todo})}>
														SEE MORE
													</Button>
												</CardActions>
											</Grid>
											<Grid item xs={12} md={8} className={classes.body}>
												<Typography variant="body2" component="p">
													{`${todo.body}`}
												</Typography>
											</Grid>
										</Grid>
								</Card>
							</Grid>
						))}
					</Grid>

					{/* Review expansion */}
					<Dialog 
						onClose={handleViewClose}
						aria-labelledby="customized-dialog-title"
						open={viewOpen}
						fullWidth 
						classes={{ paperFullWidth: classes.dialogeStyle }}
					>
						<DialogTitle id="customized-dialog-title" onClose={handleViewClose}>
							{this.state.title}
						</DialogTitle>
						<DialogContent dividers>
							<TextField
								fullWidth
								id="todoDetails"
								name="body"
								multiline
								readOnly
								rows={1}
								rowsMax={25}
								value={this.state.body}
								InputProps={{
									disableUnderline: true
								}}
							/>
						</DialogContent>
					</Dialog>
				</main>
			);
		}
	}
};

export default (withStyles(styles))(todo);