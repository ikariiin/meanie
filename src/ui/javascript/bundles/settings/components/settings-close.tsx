import * as React from 'react';

import CloseIcon from "@material-ui/icons/Close"
import { IconButton } from '@material-ui/core';

export const SettingsClose: React.FunctionComponent<{
  close: () => void;
  className?: string;
}> = ({ close, className }): JSX.Element => (
  <IconButton size="medium" color="secondary" className={className} onClick={close}>
    <CloseIcon />
  </IconButton>
);