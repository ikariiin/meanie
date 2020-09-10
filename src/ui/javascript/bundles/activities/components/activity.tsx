import * as React from "react";
import "../scss/activity.scss"
import { teal, red } from "@material-ui/core/colors";
import { GetApp as DownloadIcon, ExpandMore as DropDownArrowIcon } from "@material-ui/icons";
import {
  Button,
  IconButton,
  LinearProgress,
  Tooltip
} from "@material-ui/core";
import { ITorrent_Transportable, Torrent_Transportable, MutationType } from "../../../../../behind/modules/torrent";
import { observer } from "mobx-react";
import { action, computed, observable } from "mobx";
import { parseAnimeTitle } from "../util/anitomy.api";
import { AnitomyParsedTitle } from "../../../../../behind/modules/anitomy";
import { Skeleton } from "@material-ui/lab";
import { duration } from "moment";
import { humanFileSize, shorten } from "../util/lengths";
import { serveFile, pauseTorrent, resumeTorrent, deleteTorrent } from "../../display/utils/torrent.api";
import { WebSocketClient } from "../../display/utils/websocket-client";
import { ActivityDeleteDialog } from "./activity-delete-dialog";

export interface ActivityProps {
  torrent: ITorrent_Transportable;
  websocket: WebSocketClient;
}

@observer
export class Activity extends React.Component<ActivityProps> {
  @observable private parsedName: null|AnitomyParsedTitle = null;
  @observable protected expanded: boolean = false;
  @observable private videoURI: string | null = null;
  @observable private confirmDialogOpen: boolean = false;
  @observable private deleteFiles: boolean = false;

  @action public async parseTitle(): Promise<void> {
    this.parsedName = await parseAnimeTitle(this.props.torrent.title);
  }

  @action private subscribe(): void {
    this.props.websocket.subscribe(
      "torrents-mutation",
      (mutation: {
        uuid: string;
        torrent: Torrent_Transportable;
        mutationType: MutationType;
      }) => {
        console.log(mutation);
    });
  }

  componentDidMount(): void {
    this.parseTitle();
    this.subscribe();
  }

  @computed private get renderTimeLeft() {
    if (this.props.torrent.webTorrent.done) return "Done";
    if (this.props.torrent.webTorrent.timeRemaining === null) return "∞";

    return duration(this.props.torrent.webTorrent.timeRemaining).humanize();
  }

  private toggleExpansion(): void {
    this.expanded = !this.expanded;
  }

  private toggleTorrentState(): void {
    if (this.props.torrent.paused) {
      resumeTorrent(this.props.torrent);
    } else {
      pauseTorrent(this.props.torrent);
    }
  }

  private renderTitle(blocky: boolean = false) {
    return (
      <div className="title">
        {
          blocky ? (
            <section className="block-title">
              <div className="status-icon" style={{ background: this.props.torrent.paused ? red[400] : teal[400] }}>
                <DownloadIcon style={{ fontSize: "inherit" }} />
              </div>
              {this.parsedName ? this.parsedName.anime_title : <Skeleton height={15} width="100%" variant="rect" />}
            </section>
          )
          :(
            this.parsedName ? this.parsedName.anime_title : <Skeleton height={15} width="100%" variant="rect" />
          )
        }
        {this.parsedName && this.parsedName.release_group && (
          <div className="tag">
            {this.parsedName.release_group}
          </div>
        )}
        {this.parsedName && this.parsedName.video_resolution && (
          <>
            <div className="tag">
              {this.parsedName.video_resolution}
            </div>
            <div className="tag">
              Ep {this.parsedName.episode_number}
            </div>
          </>
        )}
      </div>
    );
  }

  private get inlineActivity() {
    return (
      <>
        <Tooltip title={this.props.torrent.paused ? "Paused" : "Downloading"}>
          <div className="status-icon" style={{ background: this.props.torrent.paused ? red[400] : teal[400] }}>
            <DownloadIcon style={{ fontSize: "inherit" }} />
          </div>
        </Tooltip>
        <div className="container title-container">
          <div className="section-label">
            Name
          </div>
          <Tooltip title={this.props.torrent.title} placement="bottom-start">
            {this.renderTitle()}
          </Tooltip>
        </div>
        <section className="container progress-container">
          <div className="section-label">
            Progress: {(this.props.torrent.webTorrent.progress * 100).toFixed(2)}% at {humanFileSize(this.props.torrent.webTorrent.downloadSpeed, true)}/s
          </div>
          <LinearProgress
            variant="determinate"
            value={this.props.torrent.webTorrent.progress * 100}
            color="primary"
            className="progress"
          />
        </section>
        <section className="container time-container">
          <div className="section-label">
            Time Left
          </div>
          <time>
            {/*<Skeleton height={15} width={150} variant="rect" />*/}
            {this.props.torrent.webTorrent.done ? 'Transfer Complete!' : `Time left: ${this.renderTimeLeft}`}
          </time>
        </section>
        <div className="btn">
          <IconButton onClick={() => this.toggleExpansion()}>
            <DropDownArrowIcon />
          </IconButton>
        </div>
      </>
    );
  }

  private async serveFile(index: number): Promise<void> {
    const uri = await serveFile(this.props.torrent.webTorrent.infoHash, index);
    this.videoURI = uri.uri;
  }

  private get expandedActivity() {
    return (
      <>
        {this.renderTitle(true)}
        <section className="progress-field">
          <div className="progress-container">
            <div className="complete-percentage">{(this.props.torrent.webTorrent.progress * 100).toFixed(1)}%</div>
            <LinearProgress className="progress" variant="determinate" value={this.props.torrent.webTorrent.progress * 100} color="primary" />
            <section className="download-speed">
              {humanFileSize(this.props.torrent.webTorrent.downloadSpeed, true)}/s
            </section>
            <time>
              {this.props.torrent.webTorrent.done ? 'Transfer Complete!' : `Time left: ${this.renderTimeLeft}`}
            </time>
          </div>
        </section>
        <section className="announce-and-files" onClick={event => event.stopPropagation()}>
          {this.videoURI && (
            <video controls>
              <source src={this.videoURI} type="video/webm" />
            </video>
          )}
        </section>
        <section className="controls-container" onClick={event => event.stopPropagation()}>
          <Button color="default" onClick={() => this.toggleExpansion()}>
            Close
          </Button>
          {this.videoURI && (
            <Button color="default" onClick={() => this.videoURI = null}>
              Close Preview
            </Button>
          )}
          <Button color="primary" onClick={() => this.confirmDialogOpen = true}>
            Delete
          </Button>
          <Button color="secondary" onClick={ev => { ev.stopPropagation(); this.toggleTorrentState(); }}>
            {this.props.torrent.paused ? "Start" : "Pause"}
          </Button>
        </section>
      </>
    )
  }

  @computed private get conditionalExpansionRender(): any {
    if(!this.expanded) return this.inlineActivity;

    return this.expandedActivity;
  }

  @computed private get deleteDialog(): React.ReactNode {
    if (this.confirmDialogOpen) {
      return (
        <ActivityDeleteDialog
          deleteFiles={this.deleteFiles}
          onClose={() => this.confirmDialogOpen = false}
          onConfirm={() => {
            deleteTorrent(this.props.torrent, this.deleteFiles);
            this.confirmDialogOpen = false;
           }}
          onDeleteFilesChange={val => this.deleteFiles = val}
          torrent={this.props.torrent}
        />
      );
    }
    return null;
  }

  public render() {
    return (
      <section className={`activity ${this.expanded ? 'expanded' : ''}`}>
        {this.deleteDialog}
        {this.conditionalExpansionRender}
      </section>
    )
  }
}