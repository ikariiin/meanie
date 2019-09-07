import * as React from 'react';
import {Title} from "../../common/components/title";
import "../scss/current-activities.scss";
import {NoActivityDisplay} from "../../activities/components/no-activity-display";
import {computed, observable} from "mobx";
import {Activity} from "../../activities/components/activity";
import {WebSocketClient} from "../utils/websocket-client";
import {IActivity} from "../../../../../behind/modules/torrent";

export class CurrentActivities extends React.Component<{}> {
  private websocket!: WebSocketClient;

  @observable private activities: Array<IActivity> = [{
    title: "[HorribleSubs] Kimetsu no Yaiba - 22 [720p]",
    dir: "E:\\TV Series\\Kimetsu no Yaiba"
  }];

  componentDidMount(): void {
    this.websocket = new WebSocketClient("9090");
    this.subscribe();
  }

  private subscribe(): void {
    if(!this.websocket) return;

    this.websocket.addOpenHandler(() => {
      this.websocket.subscribe("activity");
    });
  }

  @computed public get activitiesRender(): React.ReactNode {
    if(this.activities.length === 0) return <NoActivityDisplay />;

    return (
      <section className="activities">
        {this.activities.map(activity => (
          <Activity {...activity} />
        ))}
      </section>
    )
  }

  public render() {
    return (
      <section className="current-activities">
        <Title>
          Activities
        </Title>
        {this.activitiesRender}
      </section>
    );
  }
}