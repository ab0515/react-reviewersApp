import React from 'react';
import { useLocation } from 'react-router-dom';

import withStyle from '@material-ui/core/styles/withStyles';
import { AppBar, CssBaseline, Toolbar, Typography } from '@material-ui/core';

const style = (theme) => ({
	root: {
		display: 'flex',
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		background: 'transparent',
		boxShadow: 'none',
	},
});

const NavBar = (props) => {
	const { classes } = props;
	let location = useLocation();

	if (location.pathname === '/') {
		return (
			<div className={classes.root}>
				<CssBaseline />
				<AppBar position="fixed" className={classes.appBar}>
					<Toolbar>
						<Typography variant="h6" noWrap>
							Reviewers
						</Typography>
					</Toolbar>
				</AppBar>
			</div>
		);
	} else {
		return false;
	}
};

export default withStyle(style)(NavBar);