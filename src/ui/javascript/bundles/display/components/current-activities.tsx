import '../scss/current-activities.scss';

import { Button } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import { computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { ITorrent_Transportable } from '../../../../../behind/modules/torrent';
import { ActivitiesManageBar, SortParams } from '../../activities/components/activities-manage-bar';
import { Activity } from '../../activities/components/activity';
import { NoActivityDisplay } from '../../activities/components/no-activity-display';
import { Title } from '../../common/components/title';
import { WebSocketClient } from '../utils/websocket-client';
import { getRunningTorrents, submitTorrent } from '../utils/torrent.api';
import { Downloads } from '../../../../../behind/entitiy/downloads';

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

  private async subscribe(): Promise<void> {
    if(!this.websocket) return;

    this.websocket.addOpenHandler(() => {
      this.websocket.subscribe("activity", (newData: any) => this.handleTorrentsMutation(newData));
    });
    
    const runningTorrents = await getRunningTorrents();
    runningTorrents.forEach(({ details }: Downloads) => {
      submitTorrent({
        date: details.date,
        leechers: details.leechers,
        pageLink: details.pageLink,
        seeders: details.seeders,
        size: details.size,
        title: details.title,
        torrentLink: details.torrentLink
      });
    })
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