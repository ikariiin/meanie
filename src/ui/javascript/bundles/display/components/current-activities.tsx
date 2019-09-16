import * as React from 'react';
import {Title} from "../../common/components/title";
import "../scss/current-activities.scss";
import {NoActivityDisplay} from "../../activities/components/no-activity-display";
import {computed, observable} from "mobx";
import {Activity} from "../../activities/components/activity";
import SettingsIcon from "@material-ui/icons/Settings";
import {WebSocketClient} from "../utils/websocket-client";
import {Button} from "@material-ui/core";
import {ActivitiesManageBar, SortParams} from "../../activities/components/activities-manage-bar";
import {ITorrent_Transportable} from "../../../../../behind/modules/torrent";
import {observer} from "mobx-react";

export interface CurrentActivitiesProps {
  toggleSettingsDisplay: () => void
}

@observer
export class CurrentActivities extends React.Component<CurrentActivitiesProps> {
  private websocket!: WebSocketClient;

  @observable private torrents: Array<ITorrent_Transportable> = [];
  @observable sortBy: SortParams = SortParams.Title;
  @observable search: string = "";

  componentDidMount(): void {
    this.websocket = new WebSocketClient("9090");
    this.subscribe();
  }

  private handleTorrentsMutation(mutation: any) {
    console.log(mutation);
    this.torrents = mutation.torrents;
  }

  private subscribe(): void {
    if(!this.websocket) return;

    this.websocket.addOpenHandler(() => {
      this.websocket.subscribe("activity", (newData: any) => this.handleTorrentsMutation(newData));
    });
  }

  @computed public get activitiesRender(): React.ReactNode {
    if(this.torrents.length === 0) return <NoActivityDisplay />;

    return (
      <section className="activities">
        <ActivitiesManageBar onSearch={search => this.search = search} onSortChange={sortBy => this.sortBy = sortBy} />
        {this.torrents.map(activity => (
          <Activity {...activity} />
        ))}
      </section>
    )
  }

  public render() {
    return (
      <section className="current-activities">
        <Title secondary={
          <Button className="settings-open-button" variant="outlined" color="default" onClick={() => this.props.toggleSettingsDisplay()}>
            <SettingsIcon className="util--icon-right-space" />
            Settings
          </Button>
        }>
          Activities
        </Title>
        {this.activitiesRender}
      </section>
    );
  }
}