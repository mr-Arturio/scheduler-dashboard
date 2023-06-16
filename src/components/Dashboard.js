import React, { Component } from "react";

import Loading from './Loading';
import Panel from "./Panel";
import classnames from "classnames";

//mock data
const data = [
  {
    id: 1,
    label: "Total Interviews",
    value: 6
  },
  {
    id: 2,
    label: "Least Popular Time Slot",
    value: "1pm"
  },
  {
    id: 3,
    label: "Most Popular Day",
    value: "Wednesday"
  },
  {
    id: 4,
    label: "Interviews Per Day",
    value: "2.3"
  }
];

class Dashboard extends Component {
  state = {
    loading: false,
    focused: null // Added the focused state with a default value of null
  };


  selectPanel(id) {
    this.setState({
     focused: id
    });
   }

  render() {
    const { focused, loading } = this.state;
    const dashboardClasses = classnames("dashboard", {
      "dashboard--focused": this.state.focused
     });

    if (loading) {
      return <Loading />;
    }

    const panels = (focused ? data.filter(panel => focused === panel.id) : data)
    .map(panel => (
      <Panel
        key={panel.id}
        id={panel.id}
        label={panel.label}
        value={panel.value}
        onSelect={this.selectPanel} // Passed the selectPanel function as a prop to Panel
      />
    ));

    return <main className={dashboardClasses}>{panels}</main>;
  }
}

export default Dashboard;
