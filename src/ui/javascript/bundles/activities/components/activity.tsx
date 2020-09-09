import * as React from "react";
import "../scss/activity.scss"
import { teal } from "@material-ui/core/colors";
import DownloadIcon from "@material-ui/icons/CloudDownload";
import {
  Button,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Tooltip,
  Typography
} from "@material-ui/core";
import DropDownArrowIcon from "@material-ui/icons/ExpandMore";
import { File, ITorrent_Transportable } from "../../../../../behind/modules/torrent";
import { observer } from "mobx-react";
import { action, computed, observable } from "mobx";
import { parseAnimeTitle } from "../util/anitomy.api";
import { AnitomyParsedTitle } from "../../../../../behind/modules/anitomy";
import { Skeleton } from "@material-ui/lab";
import { duration } from "moment";
import { humanFileSize, shorten } from "../util/lengths";
import { serveFile, pauseTorrent, resumeTorrent } from "../../display/utils/torrent.api";

@observer
export class Activity extends React.Component<ITorrent_Transportable> {
  @observable private parsedName: null|AnitomyParsedTitle = null;
  @observable protected expanded: boolean = false;
  @observable private videoURI: string|null = null;

  @action public async parseTitle(): Promise<void> {
    this.parsedName = await parseAnimeTitle(this.props.title);
  }

  componentDidMount(): void {
    this.parseTitle();
  }

  @computed private get renderTimeLeft() {
    if (this.props.webTorrent.done) return "Done";
    
    if (this.props.webTorrent.timeRemaining === null) return "∞";

    return duration(this.props.webTorrent.timeRemaining).humanize();
  }

  private toggleExpansion(): void {
    this.expanded = !this.expanded;
  }

  private toggleTorrentState(): void {
    if (this.props.paused) {
      resumeTorrent(this.props);
    } else {
      pauseTorrent(this.props);
    }
  }

  private renderTitle(blocky: boolean = false) {
    return (
      <div className="title">
        {
          blocky ? (
            <section className="block-title">
              <div className="status-icon" style={{ background: teal[400] }}>
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
        <div className="status-icon" style={{ background: teal[400] }}>
          <DownloadIcon style={{ fontSize: "inherit" }} />
        </div>
        <div className="container title-container">
          <div className="section-label">
            Name
          </div>
          <Tooltip title={this.props.title} placement="bottom-start">
            {this.renderTitle()}
          </Tooltip>
        </div>
        <section className="container progress-container">
          <div className="section-label">
            Progress: {(this.props.webTorrent.progress * 100).toFixed(2)}%
          </div>
          <LinearProgress variant="determinate" value={this.props.webTorrent.progress * 100} color="primary" />
        </section>
        <section className="container time-container">
          <div className="section-label">
            Time Left
          </div>
          <time>
            {/*<Skeleton height={15} width={150} variant="rect" />*/}
            {this.props.webTorrent.done ? 'Transfer Complete!' : `Time left: ${this.renderTimeLeft}`}
          </time>
        </section>
        <div className="btn">
          <IconButton>
            <DropDownArrowIcon />
          </IconButton>
        </div>
      </>
    );
  }

  private async serveFile(index: number): Promise<void> {
    const uri = await serveFile(this.props.webTorrent.infoHash, index);
    this.videoURI = uri.uri;
  }

  private renderFileListSecondary(file: File) {
    return (
      <>
        <section className="info">
          Size: {humanFileSize(file.size, true)}
        </section>
        <section className="file-progress">
          <span className="percentage">{(file.progress * 100).toFixed(1)}%</span>
          <LinearProgress className="progress-l" value={file.progress * 100} variant="determinate" color="secondary" />
        </section>
      </>
    )
  }

  private get expandedActivity() {
    return (
      <>
        {this.renderTitle(true)}
        <section className="progress-field">
          <div className="progress-container">
            <div className="complete-percentage">{(this.props.webTorrent.progress * 100).toFixed(1)}%</div>
            <LinearProgress className="progress" variant="determinate" value={this.props.webTorrent.progress * 100} color="primary" />
            <section className="download-speed">
              {humanFileSize(this.props.webTorrent.downloadSpeed, true)}/s
            </section>
            <time>
              {this.props.webTorrent.done ? 'Transfer Complete!' : `Time left: ${this.renderTimeLeft}`}
            </time>
          </div>
        </section>
        <section className="announce-and-files" onClick={event => event.stopPropagation()}>
          <List dense className="list" component={Paper}>
            <section className="list-header">
              Announces
            </section>
            {this.props.webTorrent.announce.slice(0, 7).map(announce => (
              <ListItem>
                <ListItemText>{announce}</ListItemText>
              </ListItem>
            ))}
            {this.props.webTorrent.announce.length > 7 && (
              <ListItem dense button onClick={(ev: any) => ev.stopPropagation()}>
                <Typography variant="body2">And {this.props.webTorrent.announce.length - 8} more hidden</Typography>
              </ListItem>
            )}
          </List>
          <List dense className="list" component={Paper}>
            <section className="list-header">
              Files
            </section>
            {this.props.webTorrent.files.slice(0, 3).map((file, index) => (
              <ListItem button onClick={() => this.serveFile(index)}>
                <ListItemText secondary={this.renderFileListSecondary(file)}>
                  {shorten(file.name, 45)}
                </ListItemText>
              </ListItem>
            ))}
            {this.props.webTorrent.files.length > 3 && (
              <ListItem dense button onClick={(ev: any) => ev.stopPropagation()}>
                <Typography variant="body2">And {this.props.webTorrent.files.length - 4} more hidden</Typography>
              </ListItem>
            )}
          </List>
          {this.videoURI && (
            <video controls>
              <source src={this.videoURI} type="video/webm" />
            </video>
          )}
        </section>
        <section className="controls-container">
          <Button color="default">
            Close Detailed View
          </Button>
          {this.videoURI && (
            <Button color="default">
              Close Preview
            </Button>
          )}
          <Button color="default">
            Cancel Download
          </Button>
          <Button color="secondary" onClick={ev => { ev.stopPropagation(); this.toggleTorrentState(); }}>
            {this.props.paused ? "Start" : "Pause"}
          </Button>
        </section>
      </>
    )
  }

  @computed private get conditionalExpansionRender(): any {
    if(!this.expanded) return this.inlineActivity;

    return this.expandedActivity;
  }

  public render() {
    return (
      <section className={`activity ${this.expanded ? 'expanded' : ''}`} onClick={() => this.toggleExpansion()}>
        {this.conditionalExpansionRender}
      </section>
    )
  }
}