import * as React from 'react';
import { Dialog, DialogTitle, DialogContent, FormControlLabel, Tooltip, Checkbox, DialogActions, Button, FormGroup, Typography } from '@material-ui/core';
import { ITorrent_Transportable } from '../../../../../behind/modules/torrent';

export interface ActivityDeleteDialogProps {
  onClose: () => void;
  onDeleteFilesChange: (state: boolean) => void;
  deleteFiles: boolean;
  onConfirm: () => void;
  torrent: ITorrent_Transportable;
}

export class ActivityDeleteDialog extends React.Component<ActivityDeleteDialogProps> {
  public render() {
    return (
      <Dialog open={true} onClose={this.props.onClose}>
        <DialogTitle>
          Delete torrent
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" color="textSecondary">
            Are you sure, you want to delete {this.props.torrent.webTorrent.name}?
          </Typography>
          <FormGroup>
            <FormControlLabel
              label={
                <Tooltip title={this.props.torrent.dir}>
                  <span>Delete downloaded files</span>
                </Tooltip>
              }
              control={
                <Checkbox
                  checked={this.props.deleteFiles}
                  onChange={ev => this.props.onDeleteFilesChange(ev.target.checked)}
                />
              }
            />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button variant="text" color="default" onClick={this.props.onClose}>
            Cancel
          </Button>
          <Button variant="text" color="secondary" onClick={this.props.onConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}
