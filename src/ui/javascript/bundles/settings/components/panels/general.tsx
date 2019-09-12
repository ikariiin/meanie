import * as React from 'react';
import {SettingsPanel} from "./settings-panel";
import {SettingItem} from "./setting-item";
import {TextField} from "@material-ui/core";

export class GeneralPanel extends React.Component<{}> {
  public render() {
    return (
      <SettingsPanel title="General">
        <SettingItem name="How frequently to look for new torrents">
          <TextField className="settings-input" label="Interval in seconds" placeholder="Example: 600 (10 minutes)" variant="outlined" />
        </SettingItem>
      </SettingsPanel>
    )
  }
}