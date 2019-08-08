import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const styles = {
	card: {
		maxWidth: 400,
		display: 'inline-block',
		padding: '8px',
		margin: '8px',
	},
	button: {
		width: '100%',
	},
	media: {
		height: 240,
	},
	state: {
		color: 'red',
		fontWeight: 800,
		fontSize: '35px',
		textShadow: '0px 0px 5px rgba(0,0,0,0.42)',
	},
	title: {
		height: 70,
	},
};

class PackageCard extends React.Component {
	render () {
		const { classes, item, btnActionMap } = this.props;
		const buttons = [];
		const description
			= item.description.length > 200
				? `${item.description.substring(0, 200)}...`
				: item.description;
		const status = `${item.type} - ${item.state}`;
		const actionDefault = it => {
			console.log('>>>>Default Action', it);
			const actions = _.values(btnActionMap);
			if (actions && actions.length === 1) {
				actions[0](it);
			}
		};

		_.each(btnActionMap, (btnAction, btnName) => {
			buttons.push(
				<Button
					key={btnName}
					size="small"
					color="primary"
					onClick={() => btnAction(item)}
					className={classes.button}
				>
					{btnName}
				</Button>
			);
		});

		return (
			<Card className={classes.card}>
				<CardActionArea onClick={() => actionDefault(item)}>
					<CardMedia
						className={classes.media}
						image={item.imageUrl}
						title={item.name}
					/>
					<CardContent>
						<Typography gutterBottom variant="h5">
							<div className={classes.state}>{status}</div>
							<div className={classes.title}>{item.name}</div>
						</Typography>
						<Typography component="p">{description}</Typography>
					</CardContent>
				</CardActionArea>
				<CardActions>{buttons}</CardActions>
			</Card>
		);
	}
}

PackageCard.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PackageCard);
