import React from "react";
import ReactDOM from "react-dom";
import { hot } from 'react-hot-loader/root';

class AppCls extends React.Component {
  render() {
    const { name } = this.props;
    return (
      <>
        <h1>
          Hello {name}
        </h1>
      </>
    );
  }
}

const App = hot(AppCls)

var mountNode = document.getElementById("app");
ReactDOM.render(<App name="Jane" />, mountNode);