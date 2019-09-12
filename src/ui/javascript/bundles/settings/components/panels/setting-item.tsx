import * as React from 'react';
import "../../scss/panels/setting-item.scss";

export interface SettingItemProps {
  name: string;
  children: any;
}

export const SettingItem: React.FunctionComponent<SettingItemProps> = ({ name, children }): JSX.Element => (
  <section className="setting-item">
    <div className="setting-name">
      {name}
    </div>
    <div className="space" />
    <div className="control">
      {children}
    </div>
  </section>
);