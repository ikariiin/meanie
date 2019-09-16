import * as React from 'react';
import {SettingsPanel} from "./settings-panel";
import {SettingItem} from "./setting-item";
import {TextField} from "@material-ui/core";
import {observable} from "mobx";
import {Settings} from "../../../../../../behind/entitiy/settings";
import {fetchConfig} from "../../utils/config.api";
import {observer} from "mobx-react";

@observer
export class GeneralPanel extends React.Component<{}> {
  @observable private config: {[key: string]: Settings} = {};

  protected async initConfig(): Promise<void> {
    this.config["general.pollRate"] = await fetchConfig("general.pollRate");
  }

  componentDidMount(): void {
    this.initConfig();
  }

  public render() {
    return (
      <SettingsPanel title="General">
        <SettingItem name="How frequently to look for new torrents">
          <TextField
            className="settings-input"
            label="Interval in seconds"
            placeholder="Example: 600 (10 minutes)"
            value={this.config["general.pollRate"] ? this.config["general.pollRate"].value : "Loading..."}
            onChange={() => {}}
            variant="outlined" />
        </SettingItem>
      </SettingsPanel>
    )
  }
}