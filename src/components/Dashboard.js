import React, { Component } from "react";
import classnames from "classnames";
import Loading from "./Loading";
import Panel from "./Panel";
import axios from "axios";
import {
  getTotalInterviews,
  getLeastPopularTimeSlot,
  getMostPopularDay,
  getInterviewsPerDay
} from "helpers/selectors";


const data = [
  {
    id: 1,
    label: "Total Interviews",
    getValue: getTotalInterviews,
  },
  {
    id: 2,
    label: "Least Popular Time Slot",
    getValue: getLeastPopularTimeSlot
  },
  {
    id: 3,
    label: "Most Popular Day",
    getValue: getMostPopularDay,
  },
  {
    id: 4,
    label: "Interviews Per Day",
    getValue: getInterviewsPerDay,
  },
];


class Dashboard extends Component {
  state = {
    loading: true,
    focused: null,
    days: [],
    appointments: {},
    interviewers: {}
  };

  selectPanel(id) {
    this.setState((previousState) => ({
      focused: previousState.focused !== null ? null : id,
    }));
  }

  componentDidMount() {
    const focused = JSON.parse(localStorage.getItem("focused"));

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

    this.socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    if (focused) {
      this.setState({ focused });
    }
  }

  componentDidUpdate(previousProps, previousState) {
    if (previousState.focused !== this.state.focused) {
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
  }

  componentWillUnmount() {
    this.socket.close();
  }

  // Why doesn't Local Storage in DevTools > Application update instantaneously?
  // Why do we need to click elsewhere then back to LS to see focused value update?

  // My solution. It does work, but what's wrong with this?
  // if (this.state.focused) {
  //   this.setState({
  //     focused: null
  //   });
  // }

  render() {
    const dashboardClasses = classnames("dashboard", {
      "dashboard--focused": this.state.focused,
    });

    if (this.state.loading) {
      return <Loading />;
    }

    const indivPanels = (
      this.state.focused
        ? data.filter((panel) => this.state.focused === panel.id)
        : data
    ).map((panel) => {
      return (
        <Panel
          key={panel.id}
          label={panel.label}
          value={panel.getValue(this.state)} // Does this change dynamically?
          onSelect={() => this.selectPanel(panel.id)}
        />
      );
    });

    return <main className={dashboardClasses}>{indivPanels}</main>;
  }
}

export default Dashboard;
