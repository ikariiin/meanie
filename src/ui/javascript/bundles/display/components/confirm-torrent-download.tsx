import * as React from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@material-ui/core";
import {SearchResult} from "./search-result";
import {FeedResult} from "./result-box";

export interface ConfirmTorrentDownloadProps {
  close: () => any;
  feed: FeedResult;
  confirm: () => any;
};

export const ConfirmTorrentDownload: React.FunctionComponent<ConfirmTorrentDownloadProps> = (
  { confirm, close, feed }: ConfirmTorrentDownloadProps
): JSX.Element => (
  <Dialog open={true} onClose={close}>
    <DialogTitle>
      Confirm Torrent Download
    </DialogTitle>
    <DialogContent>
      <DialogContentText>
        Do you want to download this single torrent?
        <SearchResult {...feed} disableClick />
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={close} color="default">
        Cancel
      </Button>
      <Button onClick={confirm} color="secondary" autoFocus>
        Download
      </Button>
    </DialogActions>
  </Dialog>
);