import * as React from 'react';
import "../scss/middle-text-heads-up.scss";

export interface IMiddleTextHeadsUp {
  children: any;
}

export const MiddleTextHeadsUp: React.FunctionComponent<IMiddleTextHeadsUp> =  ({ children }: IMiddleTextHeadsUp): JSX.Element => (
  <div className="middle-text-heads-up">
    {children}
  </div>
);