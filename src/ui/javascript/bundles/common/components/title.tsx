import * as React from 'react';
import "../scss/title.scss";

export interface ITitle {
  children: any;
  block?: boolean;
}

export const Title: React.FunctionComponent<ITitle> = ({children, block}: ITitle): JSX.Element => (
  <div className="title" style={{ display: block ? 'block' : 'inline-block' }}>
    {children}
  </div>
);