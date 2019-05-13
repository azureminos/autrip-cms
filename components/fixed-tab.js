import React, {createElement} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';

import _ from 'lodash';

function TabContainer({children, dir}) {
  return (
    <Typography component='div' dir={dir} style={{padding: 8}}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
});

class FullWidthTabs extends React.Component {
  state = {
    tabIndex: 0,
  };

  handleChange = (event, value) => {
    this.setState({tabIndex: value});
  };

  render() {
    const {classes, theme, tabs} = this.props;
    const tabItems = [];
		const tabContents = [];
		
		let displayedTab;

    _.forEach(tabs, (item, key) => {
      tabItems.push((<Tab label={key} key={key} />));
			tabContents.push((<TabContainer dir={theme.direction} key={key} >{item}</TabContainer>));
			if (Object.keys(tabs)[this.state.tabIndex] == key) {
				displayedTab = tabContents[this.state.tabIndex];
			}
    });

    return (
      <div className={classes.root}>
        <AppBar position='sticky' color='default'>
          <Tabs
            value={this.state.tabIndex}
            onChange={this.handleChange}
            indicatorColor='primary'
            textColor='primary'
            variant="fullWidth"
          >
            {tabItems}
          </Tabs>
        </AppBar>
        {displayedTab}
      </div>
    );
  }
}

FullWidthTabs.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, {withTheme: true})(FullWidthTabs);
