import React, { createElement } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';

const FooterContainer = styled.div`
display: flex;
flex-direction: column;
background: lightgrey;
`;

class Footer extends React.Component {
	render () {
		const { text } = this.props;
		return (
			<FooterContainer>
				<Typography variant='caption'>{text}</Typography>
			</FooterContainer>
		);
	}
}

export default Footer;
