import React from 'react';
import PaypalExpressBtn from 'react-paypal-express-checkout';
// ==== Styles ==============================================
import { withStyles } from '@material-ui/core/styles';
import helper from '../../lib/helper';

const styles = theme => ({
	button: {},
});

class PaypalButton extends React.Component {
	constructor (props) {
		super(props);
		// Bind handler
		// Set state
	}

	render () {
		const { classes, env, currency, total, client } = this.props;

		const onSuccess = payment => {
			// Congratulation, it came here means everything's fine!
			console.log('The payment was succeeded!', payment);
		};

		const onCancel = data => {
			// User pressed "cancel" or close Paypal's popup!
			console.log('The payment was cancelled!', data);
		};

		const onError = err => {
			// The main Paypal's script cannot be loaded or somethings block the loading of that script!
			console.log('Error!', err);
		};

		return (
			<PaypalExpressBtn
				env={env}
				client={client}
				currency={currency}
				total={total}
				onError={onError}
				onSuccess={onSuccess}
				onCancel={onCancel}
			/>
		);
	}
}

export default withStyles(styles)(PaypalButton);
