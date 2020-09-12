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
  componentDidMount(): void {
  }

  
  public render() {
    return (
      <section className={`activity `}>
        Activity
      </section>
    )
  }
}