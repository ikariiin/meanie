import * as React from "react";
import {SettingsPanel} from "./settings-panel";
import {SettingItem} from "./setting-item";
import {TextField} from "@material-ui/core";
import {observable} from "mobx";
import {Settings} from "../../../../../../behind/entitiy/settings";
import {fetchConfig} from "../../utils/config.api";

export class FilesPanel extends React.Component<{}> {
  @observable private config: {[key: string]: Settings} = {};

  protected async initConfig(): Promise<void> {
    this.config["fs.savePath"] = await fetchConfig("fs.savePath");
  }

  componentDidMount(): void {
    this.initConfig();
  }

  public render() {
    return (
      <SettingsPanel title="Files and Folders">
        <SettingItem name="Store downloaded files at">
          <TextField
            className="settings-input"
            label="Path"
            value={this.config["fs.savePath"] ? this.config["fs.savePath"].value : "Loading..."}
            placeholder="Example: /home/u/Downloads"
            size="small"
            variant="outlined" />
        </SettingItem>
      </SettingsPanel>
    )
  }
}