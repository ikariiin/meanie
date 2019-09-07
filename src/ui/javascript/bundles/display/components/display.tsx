import * as React from 'react';
import {InputPane} from "./input-pane";
import "../scss/display.scss";
import {CurrentActivities} from "./current-activities";

export const Display: React.FunctionComponent = ({  }): JSX.Element => (
  <section className="display-container">
    <InputPane />
    <CurrentActivities />
  </section>
);