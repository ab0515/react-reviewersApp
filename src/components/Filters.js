import React, { useEffect, useState } from 'react';

import withStyle from '@material-ui/core/styles/withStyles';
import { InputLabel, Select, MenuItem, FormControl, Menu } from '@material-ui/core';

const style = (theme) => ({
	root: {
		display: 'flex',
		justifyContent: 'flex-end',
	},
	formControl: {
		margin: theme.spacing(1),
    	minWidth: 120,
	},
});

const Filters = (props) => {
	const { sortBy, onSorting } = props;
	const { classes } = props;

	return (
		<div className={classes.root}>
			<FormControl className={classes.formControl}>
				<InputLabel id="sort-id-label">Sort by</InputLabel>
				<Select
					labelId="sort-id-label"
					id="sort-id"
					onChange={onSorting}
					value={sortBy}
				>
					<MenuItem value={1}>Newest First</MenuItem>
					<MenuItem value={2}>Oldest First</MenuItem>
					<MenuItem value={3}>Rating: Lowest to Highest</MenuItem>
					<MenuItem value={4}>Rating: Highest to Lowest</MenuItem>
				</Select>
			</FormControl>
		</div>
	);
};

export default withStyle(style)(Filters);