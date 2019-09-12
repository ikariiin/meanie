import * as React from "react";
import {SettingsPanel} from "./settings-panel";
import {SettingItem} from "./setting-item";
import {TextField} from "@material-ui/core";

export class FilesPanel extends React.Component<{}> {
  public render() {
    return (
      <SettingsPanel title="Files and Folders">
        <SettingItem name="Store downloaded files at">
          <TextField className="settings-input" label="Path" placeholder="Example: /home/u/Downloads" variant="outlined" />
        </SettingItem>
      </SettingsPanel>
    )
  }
}