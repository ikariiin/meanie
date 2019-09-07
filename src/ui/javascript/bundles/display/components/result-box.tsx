import * as React from 'react';
import {SearchUpIllustration} from "./search-up-illustration";
import "../scss/result-box.scss";
import {SearchResult} from "./search-result";
import {ISearchResult} from "../../../../../behind/modules/search";
import {AcceptResultFooter} from "../../forms/components/accept-result-footer";

export interface FeedResult {
  title: string;
  torrentLink: string;
  pageLink: string;
  date: string;
  seeders: number;
  leechers: number;
  size: string;
}

export interface ResultBoxProps {
  result: ISearchResult
}

export class ResultBox extends React.Component<ResultBoxProps> {
  private renderResults(): React.ReactNode {
    if(!this.props.result || this.props.result.list.length === 0) {
      return <SearchUpIllustration/>;
    }
    return (
      <>
        <div className="results-label">Showing {this.props.result.list.length} results</div>
        {this.props.result.list.sort(
          (a: FeedResult, b: FeedResult) => b.title.localeCompare(a.title)
        ).map(result => (
          <SearchResult {...result} />
        ))}
        <AcceptResultFooter url={this.props.result.url} />
      </>
    )
  }

  public render() {
    return (
      <section className="result-box">
        {this.renderResults()}
      </section>
    )
  }
}