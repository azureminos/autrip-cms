import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import IconButton from '@material-ui/core/IconButton';
import grey from '@material-ui/core/colors/grey';
import blue from '@material-ui/core/colors/blue';
import CheckIcon from '@material-ui/icons/CheckCircleOutline';
import SolidCheckIcon from '@material-ui/icons/CheckCircle';

const styles = theme => ({
	card: {
		maxWidth: 345,
	},
	media: {
		height: 0,
		paddingTop: '56.25%', // 16:9
	},
	headerRoot: {
		padding: 8,
		height: 56,
	},
	headerTitle: {
		fontSize: 14,
	},
});

class HotelCard extends React.Component {
	constructor (props) {
		console.log('>>>>HotelCard, constructor()', props);
		super(props);
	}

	render () {
		const { classes, item, doSelectHotel } = this.props;
		console.log('>>>>HotelCard render()', item);
		return (
			<Card className={classes.card}>
				<CardHeader
					classes={{ root: classes.headerRoot, title: classes.headerTitle }}
					action={
						<IconButton onClick={() => doSelectHotel(item)}>
							<CheckIcon style={{ display: this.props.item.isSelected ? 'none' : 'block', color: grey[500] }} />
							<SolidCheckIcon style={{ display: this.props.item.isSelected ? 'block' : 'none', color: blue[500] }} />
						</IconButton>
					}
					title={item.name}
				/>
				<CardActionArea onClick={() => doSelectHotel(item)}>
					<CardMedia
						className={classes.media}
						image={item.imageUrl}
						title={item.name}
					/>
				</CardActionArea>
			</Card>
		);
	}
}

export default withStyles(styles, { withTheme: true })(HotelCard);
