import React, {createElement} from 'react';
import {withStyles} from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = theme => ({
  root: {
    width: '100%',
    marginBottom: '8px',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
});

class DescPanel extends React.Component {
  state = {
    isExpanded: false,
  };

  handleChange = (expanded) => {
    this.setState({isExpanded: expanded});
  };

  render() {
    const {classes, descShort, descFull} = this.props;

    return (
      <div className={classes.root}>
        <ExpansionPanel
          onChange={(event, expanded) => this.handleChange(expanded)}
        >
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography
              style={{display: this.state.isExpanded ? 'none' : 'block'}}
              className={classes.heading}
            >
              {descShort}
            </Typography>
            <Typography
              style={{display: this.state.isExpanded ? 'block' : 'none'}}
              className={classes.heading}
            >
              {descFull}
            </Typography>
          </ExpansionPanelSummary>
        </ExpansionPanel>
      </div>
    );
  }
}

export default withStyles(styles, {withTheme: true})(DescPanel);
