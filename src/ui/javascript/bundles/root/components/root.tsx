import * as React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import {Display} from "../../display/components/display";
import "../scss/root.scss";
import {MuiThemeProvider} from "@material-ui/core";
import {AppTheme} from "../../common/components/app-theme";

export class Root extends React.Component {
  public render() {
    return (
      <main className="root-mount">
        <MuiThemeProvider theme={AppTheme}>
          <Router>
            <Route path="/" exact component={Display} />
          </Router>
        </MuiThemeProvider>
      </main>
    )
  }
}