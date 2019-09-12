import * as React from 'react';

import CloseIcon from "@material-ui/icons/Close"

export const SettingsClose: React.FunctionComponent<{ close: () => void }> = ({ close }): JSX.Element => (
  <CloseIcon style={{ fontSize: "3.5rem", cursor: "pointer" }} onClick={close} />
);