import * as React from "react";
import "../scss/activities-manage-bar.scss";
import {Sort} from "./management/sort";
import {observer} from "mobx-react";
import {observable} from "mobx";
import {Search} from "./management/search";
import {Typography} from "@material-ui/core";

export enum SortParams {
  "Title",
  "Date Published",
  "Date Added"
};

export interface ActivitiesManageBarProps {
  onSortChange: (param: SortParams) => void;
  onSearch: (search: string) => void;
}

@observer
export class ActivitiesManageBar extends React.Component<ActivitiesManageBarProps> {
  @observable sortBy: SortParams = SortParams.Title;
  @observable search: string = "";

  public render() {
    return (
      <section className="activities-manage-bar">
        <section className="section-title">
          Manage viewing options
          <div className="space" />
          <Typography variant="inherit" className="hide-link">Hide</Typography>
        </section>
        <section className="tools">
          <Sort activeParam={this.sortBy} onChange={parameter => {
            this.sortBy = parameter;
            this.props.onSortChange(parameter);
          }}/>
          <Search onChange={(search: string) => {
            this.search = search; this.props.onSearch(search);
          }} currentSearch={this.search}/>
        </section>
      </section>
    )
  }
}