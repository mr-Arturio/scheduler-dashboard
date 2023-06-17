import React, { Component } from "react";
import axios from "axios";

import Loading from "./Loading";
import Panel from "./Panel";
import classnames from "classnames";

import {
  getTotalInterviews,
  getLeastPopularTimeSlot,
  getMostPopularDay,
  getInterviewsPerDay
 } from "helpers/selectors";

//mock data
const data = [
  {
    id: 1,
    label: "Total Interviews",
    getValue: getTotalInterviews
  },
  {
    id: 2,
    label: "Least Popular Time Slot",
    getValue: getLeastPopularTimeSlot
  },
  {
    id: 3,
    label: "Most Popular Day",
    getValue: getMostPopularDay
  },
  {
    id: 4,
    label: "Interviews Per Day",
    getValue: getInterviewsPerDay
  }
];

class Dashboard extends Component {
  state = {
    days: [],
    appointments: {},
    interviewers: {},
    loading: true,
    focused: null, // Added the focused state with a default value of null
  };

  componentDidMount() {
    const focused = JSON.parse(localStorage.getItem("focused"));

    if (focused) {
      this.setState({ focused });
    }

    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then(([days, appointments, interviewers]) => {
      this.setState({
        loading: false,
        days: days.data,
        appointments: appointments.data,
        interviewers: interviewers.data,
      });
    });
  }

  componentDidUpdate(previousProps, previousState) {
    if (previousState.focused !== this.state.focused) {
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
  }

  selectPanel(id) {
    this.setState((previousState) => ({
      focused: previousState.focused !== null ? null : id,
    }));
  }

  render() {
    const { focused, loading } = this.state;
    const dashboardClasses = classnames("dashboard", {
      "dashboard--focused": this.state.focused,
    });

    if (loading) {
      return <Loading />;
    }

    const panels = (
      focused ? data.filter((panel) => focused === panel.id) : data
    ).map((panel) => (
      <Panel
      key={panel.id}
      label={panel.label}
      value={panel.getValue(this.state)}
      onSelect={() => this.selectPanel(panel.id)}
      />
    ));

    return <main className={dashboardClasses}>{panels}</main>;
  }
}

export default Dashboard;
