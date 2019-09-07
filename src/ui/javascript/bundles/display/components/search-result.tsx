import * as React from 'react';
import {FeedResult} from "./result-box";
import TorrentIcon from "@material-ui/icons/FeaturedVideo";
import SeedersIcon from "@material-ui/icons/ArrowUpward";
import LeechersIcon from "@material-ui/icons/ArrowDownward";
import DateIcon from "@material-ui/icons/Timer";
import SizeIcon from "@material-ui/icons/InsertDriveFile";
import "../scss/search-result.scss";

export const SearchResult: React.FunctionComponent<FeedResult> = ({title, seeders, leechers, size, date}: FeedResult): JSX.Element => (
  <section className="search-result">
    <section className="torrent-title">
      <div className="icon-container">
        <TorrentIcon style={{ fontSize: "inherit" }} />
      </div>
      {title}
    </section>
    <section className="details">
      <div className="field">
        <div className="icon seeds"><SeedersIcon style={{ fontSize: "inherit" }} /></div>
        {seeders}
      </div>
      <div className="field">
        <div className="icon leech"><LeechersIcon style={{ fontSize: "inherit" }} /></div>
        {leechers}
      </div>
      <div className="field">
        <div className="icon"><SizeIcon style={{ fontSize: "inherit" }} /></div>
        {size}
      </div>
      <div className="field">
        <div className="icon"><DateIcon style={{ fontSize: "inherit" }} /></div>
        {(new Date(date)).toDateString()}
      </div>
    </section>
  </section>
);