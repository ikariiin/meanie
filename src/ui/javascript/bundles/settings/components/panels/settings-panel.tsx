import * as React from 'react';
import "../../scss/panels/settings-panel.scss";
import {Paper} from "@material-ui/core";

export interface SettingsPanelProps {
  children: any;
  title: string;
}

export const SettingsPanel: React.FunctionComponent<SettingsPanelProps> = ({ children, title }): JSX.Element => (
  <Paper className="settings-panel">
    <section className="panel-title">{title}</section>
    <div className="content">
      {children}
    </div>
  </Paper>
);