import * as React from 'react';
import {InputPane} from "./input-pane";
import "../scss/display.scss";
import {CurrentActivities} from "./current-activities";
import {Settings} from "../../settings/components/settings";
import {Grow} from "@material-ui/core";
import {observer} from "mobx-react";
import {observable} from "mobx";

@observer
export class Display extends React.Component<{}> {
  @observable private displaySettings: boolean = false;

  protected toggleSettingsDisplay() {
    this.displaySettings = !this.displaySettings;
  }

  public render() {
    return (
      <section className="display-container">
        <Grow in={this.displaySettings} style={{ transformOrigin: 'bottom' }} timeout={100}>
          <Settings close={() => this.toggleSettingsDisplay()} />
        </Grow>
        <InputPane />
        <CurrentActivities toggleSettingsDisplay={() => this.toggleSettingsDisplay()} />
      </section>
    );
  }
}