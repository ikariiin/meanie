import * as React from 'react';
import "../scss/title.scss";

export interface ITitle {
  children: any;
  secondary?: any;
}

export const Title: React.FunctionComponent<ITitle> = ({children, secondary}: ITitle): JSX.Element => (
  <div className="title">
    {children}
    <div className="space" />
    {secondary && (
      <section className="secondary">
        {secondary}
      </section>
    )}
  </div>
);