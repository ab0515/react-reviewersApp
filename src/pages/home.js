import React, { Component } from 'react';
import axios from 'axios';

import Account from '../components/account';
import Todo from '../components/todo';

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import withStyles from '@material-ui/core/styles/withStyles';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import NotesIcon from '@material-ui/icons/Notes';
import Avatar from '@material-ui/core/avatar';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CircularProgress from '@material-ui/core/CircularProgress';

import { authMiddleWare } from '../util/auth';

const drawerWidth = 240;

const styles = (theme) => ({
	root: {
		display: 'flex'
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1
	},
	drawer: {
		width: drawerWidth
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3)
	},
	avatar: {
		height: 110,
		width: 110,
		flexShrink: 0,
		flexGrow: 0,
		marginTop: 20
	},
	uiProgress: {
		position: 'fixed',
		zIndex: '1000',
		height: '31px',
		width: '31px',
		left: '50%',
		top: '35%'
	},
	toolbar: theme.mixins.toolbar
})

class home extends Component {
	state = {
		render: false
	};

	loadAccountPage = (event) => {
		this.setState({ render: true });
	};

	loadTodoPage = (e) => {
		this.setState({ render: false });
	};

	logoutHandler = (e) => {
		localStorage.removeItem('AuthToken');
		this.props.history.push('/login');	// redirect to login page since log out
	};

	constructor(props) {
		super(props);

		this.state = {
			firstName: '',
			lastName: '',
			profilePicture: '',
			uiLoading: true,
			imageLoading: false
		};
	}

	componentDidMount = () => {
		authMiddleWare(this.props.history);
		const authToken = localStorage.getItem('AuthToken');
		axios.defaults.headers.common = { Authorization: `${authToken}`};
		axios 
			.get('/api/user')
			.then((res) => {
				console.log(res.data);
				this.setState({
					firstName: res.data.userCredentials.firstName,
					lastName: res.data.userCredentials.lastName,
					email: res.data.userCredentials.email,
					phoneNumber: res.data.userCredentials.phoneNumber, 
					country: res.data.userCredentials.country,
					username: res.data.userCredentials.username,
					uiLoading: false,
					profilePicture: res.data.userCredentials.imageUrl
				});
			})
			.catch((err) => {
				if (err.response && err.response.status === 403) {
					this.props.history.push('/login')
				}
				console.log(err);
				this.setState({ errMsg: 'Error while retrieving data'});
			});
	};

	render() {
		const { classes } = this.props; 
		if (this.state.uiLoading === true) {
			return (
				<div className={classes.root}>
					{this.state.uiLoading && <CircularProgress size={150} className={classes.uiProgress} />}
				</div>
			)
		} else {
			return (
				<div className={classes.root}>
					{/* <CssBaseline />
					<AppBar position="fixed" className={classes.appBar}>
						<Toolbar>
							<Typography variant="h6" noWrap>
								Reviewers
							</Typography>
						</Toolbar>
					</AppBar> */}
					<Drawer
						className={classes.drawer}
						variant="permanent"
						classes={{
							paper: classes.drawerPaper
						}}
					>
						<div className={classes.toolbar} />
						<Divider />
						<center>
							<Avatar src={this.state.profilePicture} className={classes.avatar}/>
							<p>
								{' '}
								{this.state.firstName} {this.state.lastName}
							</p>
						</center>
						<Divider />
						<List>
							<ListItem button key="Dashboard" onClick={this.loadTodoPage}>
								<ListItemIcon><NotesIcon /></ListItemIcon>
								<ListItemText primary="Dashboard" />
							</ListItem>

							<ListItem button key="Account" onClick={this.loadAccountPage}>
								<ListItemIcon><AccountBoxIcon /></ListItemIcon>
								<ListItemText primary="My Account" />
							</ListItem>

							<ListItem button key="Logout" onClick={this.logoutHandler}>
								<ListItemIcon><ExitToAppIcon /></ListItemIcon>
								<ListItemText primary="Logout" />
							</ListItem>
						</List>
					</Drawer>

					<div>{this.state.render ? <Account /> : <Todo />}</div>
				</div>
			);
		}
	}
};

export default withStyles(styles)(home);