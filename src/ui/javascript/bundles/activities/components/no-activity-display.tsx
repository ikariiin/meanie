import * as React from 'react';
import "../scss/no-activity-display.scss";

export const NoActivityDisplay: React.FunctionComponent<{}> = ({}): JSX.Element => (
  <section className="no-activity-display">
    <div className="illustration" />
    <div className="label">No activities running in the background at the moment.</div>
  </section>
);