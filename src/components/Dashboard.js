import React, { Component } from "react";
import classnames from "classnames";
import Loading from "./Loading";
import Panel from "./Panel";


// Fake data
const data = [
  {
    id: 1,
    label: "Total Interviews",
    value: 6,
  },
  {
    id: 2,
    label: "Least Popular Time Slot",
    value: "1pm",
  },
  {
    id: 3,
    label: "Most Popular Day",
    value: "Wednesday",
  },
  {
    id: 4,
    label: "Interviews Per Day",
    value: "2.3",
  },
];


class Dashboard extends Component {
  state = {
    loading: false,
    focused: null
  }

  selectPanel(id) {
    this.setState(previousState => ({
      focused: previousState.focused !== null ? null : id
    }));
  }


    // My solution. It does work, but what's wrong with this?
    // if (this.state.focused) {
    //   this.setState({
    //     focused: null
    //   });
    // }

  }

  render() {
    const dashboardClasses = classnames("dashboard", {
      "dashboard--focused": this.state.focused
    });

    if (this.state.loading) {
      return <Loading />;
    }

    const indivPanels = (this.state.focused ? data.filter(panel => this.state.focused === panel.id) : data).map((panel) => {
      return (
        <Panel
          key={panel.id}
          label={panel.label}
          value={panel.value}
          onSelect={() => this.selectPanel(panel.id)}
        />
      )
    });

    return (<main className={dashboardClasses}>
      {indivPanels}
      </main>
    );
  }
}

export default Dashboard;
