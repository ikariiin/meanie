import * as React from "react";
import "../scss/activity.scss"
import {green} from "@material-ui/core/colors";
import DownloadIcon from "@material-ui/icons/CloudDownload";
import {IconButton, LinearProgress, Tooltip} from "@material-ui/core";
import DropDownArrowIcon from "@material-ui/icons/ExpandMore";
import {ITorrent_Transportable} from "../../../../../behind/modules/torrent";
import {observer} from "mobx-react";
import {action, observable} from "mobx";
import {parseAnimeTitle} from "../util/anitomy.api";
import {AnitomyParsedTitle} from "../../../../../behind/modules/anitomy";
import {Skeleton} from "@material-ui/lab";
import {duration} from "moment";

@observer
export class Activity extends React.Component<ITorrent_Transportable> {
  @observable private parsedName: null|AnitomyParsedTitle = null;

  @action public async parseTitle(): Promise<void> {
    this.parsedName = await parseAnimeTitle(this.props.title);
  }

  componentDidMount(): void {
    this.parseTitle();
  }

  public render() {
    return (
      <section className="activity">
        <div className="status-icon" style={{ background: green["A400"] }}>
          <DownloadIcon style={{ fontSize: "inherit" }} />
        </div>
        <div className="container title-container">
          <div className="section-label">
            Name
          </div>
          <Tooltip title={this.props.title} placement="bottom-start">
            <div className="title">
              {this.parsedName ? this.parsedName.anime_title : <Skeleton height={15} width="100%" variant="rect" />}
              {this.parsedName && this.parsedName.video_resolution && (
                <div className="tag">
                  {this.parsedName.video_resolution}
                </div>
              )}
              {this.parsedName && this.parsedName.release_group && (
                <div className="tag">
                  {this.parsedName.release_group}
                </div>
              )}
            </div>
          </Tooltip>
        </div>
        <section className="container progress-container">
          <div className="section-label">
            Progress
          </div>
          <LinearProgress variant="determinate" value={this.props.webTorrent.progress * 100} color="primary" />
        </section>
        <section className="container time-container">
          <div className="section-label">
            Time Left
          </div>
          <time>
            {/*<Skeleton height={15} width={150} variant="rect" />*/}
            {duration(this.props.webTorrent.timeRemaining).humanize()}
          </time>
        </section>
        <div className="btn">
          <IconButton>
            <DropDownArrowIcon />
          </IconButton>
        </div>
      </section>
    )
  }
}