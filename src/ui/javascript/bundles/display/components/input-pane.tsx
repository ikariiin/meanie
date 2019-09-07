import * as React from 'react';
import "../scss/input-pane.scss";
import {RSSForm} from "../../forms/components/rss";
import {ResultBox} from "./result-box";
import {observable} from "mobx";
import {observer} from "mobx-react";
import {ISearchResult} from "../../../../../behind/modules/search";

@observer
export class InputPane extends React.Component<{}> {
  @observable result!: ISearchResult;

  public render() {
    return (
      <aside className="input-pane">
        <RSSForm onSearch={(results: ISearchResult) => this.result = results} />
        <ResultBox result={this.result} />
      </aside>
    );
  }
}