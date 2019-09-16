import * as React from 'react';
import {FeedResult} from "./result-box";
import TorrentIcon from "@material-ui/icons/FeaturedVideo";
import SeedersIcon from "@material-ui/icons/ArrowUpward";
import LeechersIcon from "@material-ui/icons/ArrowDownward";
import DateIcon from "@material-ui/icons/Timer";
import SizeIcon from "@material-ui/icons/InsertDriveFile";
import "../scss/search-result.scss";
import {submitTorrent} from "../utils/torrent.api";
import {observer} from "mobx-react";
import {observable} from "mobx";
import {ConfirmTorrentDownload} from "./confirm-torrent-download";

export interface SearchResultProps extends FeedResult {
  disableClick?: boolean;
}

@observer
export class SearchResult extends React.Component<SearchResultProps> {
  @observable displayConfirmationDialog: boolean = false;

  private confirmTorrentSubmission() {
    this.displayConfirmationDialog = true;
  }

  private closeConfirmationDialog() {
    this.displayConfirmationDialog = false;
  }

  private async download(): Promise<void> {
    await submitTorrent(this.props);
    this.closeConfirmationDialog();
  }

  public render() {
    return (
      <section className="search-result" onClick={this.props.disableClick ? () => {} : () => this.confirmTorrentSubmission()}>
        {this.displayConfirmationDialog && <ConfirmTorrentDownload close={() => this.closeConfirmationDialog()} confirm={() => this.download()} feed={this.props} />}
        <section className="torrent-title">
          <div className="icon-container">
            <TorrentIcon style={{ fontSize: "inherit" }} />
          </div>
          {this.props.title}
        </section>
        <section className="details">
          <div className="field">
            <div className="icon seeds"><SeedersIcon style={{ fontSize: "inherit" }} /></div>
            {this.props.seeders}
          </div>
          <div className="field">
            <div className="icon leech"><LeechersIcon style={{ fontSize: "inherit" }} /></div>
            {this.props.leechers}
          </div>
          <div className="field">
            <div className="icon"><SizeIcon style={{ fontSize: "inherit" }} /></div>
            {this.props.size}
          </div>
          <div className="field">
            <div className="icon"><DateIcon style={{ fontSize: "inherit" }} /></div>
            {(new Date(this.props.date)).toDateString()}
          </div>
        </section>
      </section>
    );
  }
}