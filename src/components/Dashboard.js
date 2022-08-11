import React, { Component } from "react";
import classnames from "classnames";

import Loading from "./Loading";

class Dashboard extends Component {
  state = {
    loading: true
  }

  render() {
    const dashboardClasses = classnames("dashboard");

    return <main className={dashboardClasses}>
      {this.state.loading && <Loading />};
    </main>
  }
}

export default Dashboard;
