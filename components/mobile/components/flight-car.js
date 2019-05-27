import React, { createElement } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import FlightTakeoff from "@material-ui/icons/FlightTakeoff";
import DirectionsCar from "@material-ui/icons/DirectionsCar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemIcon from "@material-ui/core/ListItemIcon";

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  },
  list: {
    width: "100%",
    minWidth: "330px",
    backgroundColor: theme.palette.background.paper
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  }
});

class FlightCar extends React.Component {
  state = {
    departDate: '',
    returnDate: '',
    typeGroundTransport: 'Basic',
  };

  handleCarChange = event => {
    this.setState({[event.target.name]: event.target.value});
  };

  handleFlightChange = event => {
    this.setState({departDate: event.target.value});
  };
  render() {
    console.log('>>>>FlightCar, render()', this.props);
    const {classes, isReadonly} = this.props;

    return (
      <List className={classes.list}>
        <ListItem>
          <ListItemIcon>
            <FlightTakeoff color='primary' />
          </ListItemIcon>
          <ListItemSecondaryAction>
            <div>
              <FormControl
                className={classes.formControl}
                disabled={isReadonly ? true : false}
              >
                <Select
                  value={this.state.departDate}
                  onChange={this.handleFlightChange}
                  displayEmpty
                  inputProps={{
                    name: 'departDate',
                    id: 'depart-date',
                  }}
                >
                  <MenuItem value='' disabled>
                    <em>Depart</em>
                  </MenuItem>
                  <MenuItem value={10}>03 Feb 2019</MenuItem>
                  <MenuItem value={20}>08 Feb 2019</MenuItem>
                  <MenuItem value={30}>10 Mar 2019</MenuItem>
                  <MenuItem value={40}>03 April 2019</MenuItem>
                </Select>
              </FormControl>
              <FormControl
                className={classes.formControl}
                disabled
              >
                <Select value={this.state.departDate} displayEmpty>
                  <MenuItem value=''>
                    <em>Arrive</em>
                  </MenuItem>
                  <MenuItem value={10}>07 Feb 2019</MenuItem>
                  <MenuItem value={20}>14 Feb 2019</MenuItem>
                  <MenuItem value={30}>16 Mar 2019</MenuItem>
                  <MenuItem value={40}>09 April 2019</MenuItem>
                </Select>
              </FormControl>
            </div>
          </ListItemSecondaryAction>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemIcon>
            <DirectionsCar color='primary' />
          </ListItemIcon>
          <ListItemSecondaryAction>
            <FormControl
              className={classes.formControl}
              disabled={isReadonly ? true : false}
            >
              <Select
                value={this.state.typeGroundTransport}
                onChange={this.handleCarChange}
                displayEmpty
                inputProps={{
                  name: 'typeGroundTransport',
                  id: 'typeGroundTransport-simple',
                }}
              >
                <MenuItem value='' disabled>
                  <em>Ground Transport</em>
                </MenuItem>
                <MenuItem value='Basic'>Basic</MenuItem>
                <MenuItem value='Luxury'>Luxury</MenuItem>
              </Select>
            </FormControl>
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    );
  }
}

FlightCar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FlightCar);
