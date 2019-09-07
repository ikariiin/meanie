import * as React from "react";
import "../scss/activity.scss"
import {green} from "@material-ui/core/colors";
import DownloadIcon from "@material-ui/icons/CloudDownload";
import {LinearProgress} from "@material-ui/core";
import DropDownArrowIcon from "@material-ui/icons/ExpandMore";
import {IActivity} from "../../../../../behind/modules/torrent";

export class Activity extends React.Component<IActivity> {
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
          <div className="title">
            {this.props.title}
          </div>
        </div>
        <section className="container progress-container">
          <div className="section-label">
            Progress
          </div>
          <LinearProgress variant="indeterminate" color="primary" />
        </section>
        <section className="container time-container">
          <div className="section-label">
            Time Left
          </div>
          <time>
            4 min 30 seconds
          </time>
        </section>
        <button className="drop-down-button">
          <DropDownArrowIcon style={{ fontSize: 'inherit' }} />
        </button>
      </section>
    )
  }
}