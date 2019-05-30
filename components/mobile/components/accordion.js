import React, {createElement} from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
// import scrollToComponent from 'react-scroll-to-component';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

let scrollToComponent;

const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(20),
    fontWeight: theme.typography.fontWeightRegular,
  },
});

const ExpansionPanelSummary = withStyles(theme => ({
  root: {
    padding: theme.spacing.unit,
  },
}))(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles(theme => ({
  root: {
    padding: theme.spacing.unit,
  },
}))(MuiExpansionPanelDetails);

class ControlledAccordion extends React.Component {
  constructor(props) {
    super(props);
    this.scrollMap = {};
    const titles = _.keys(props.mapContents);
    _.forEach(titles, (title) => {
      this.scrollMap[title] = React.createRef();
    });

    this.state = {
      expanded: titles ? titles[0] : false,
    };

    this.scrollToContent.bind(this);
  }

  scrollToContent = (panel) => {
    //this.scrollMap[panel].current.scrollIntoView({block: 'start', behavior: 'smooth'});
    scrollToComponent(this.scrollMap[panel]);
  };

  handleChange = (panel) => (event, expanded) => {
    console.log('>>>>ControlledAccordion, handleChange()', {panel: panel, expanded: expanded});
    const that = this;
    that.setState({
      expanded: expanded ? panel : false,
    });

    if (expanded) {
      setTimeout(
        function() {
          this.scrollToContent(panel);
        }.bind(that),
        500
      );
    }
  };

  componentDidMount() {
    scrollToComponent = require('react-scroll-to-component');
  }

  render() {
    console.log('>>>>ControlledAccordion, start render()', {props: this.props, state: this.state});
    const {classes, mapContents} = this.props;
    const {expanded} = this.state;
    const accordions = [];

    _.forEach(_.keys(mapContents), (title) => {
      const panel = (
        <div key={title} ref={(section) => {this.scrollMap[title] = section;}} className={classes.root} >
          <ExpansionPanel expanded={expanded === title} onChange={this.handleChange(title)}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading} variant='h5'>{title}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>{mapContents[title]}</Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      );
      accordions.push(panel);
    });

    return (
      <div>
        {accordions}
      </div>
    );
  }
}

ControlledAccordion.propTypes = {
  mapContents: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, {withTheme: true})(ControlledAccordion);
