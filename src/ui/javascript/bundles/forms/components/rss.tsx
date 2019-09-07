import * as React from 'react';
import "../scss/rss.scss";
import {observer} from "mobx-react";
import {observable} from "mobx";
import {Button, Chip, InputAdornment, MuiThemeProvider, TextField} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/SearchOutlined";
import CheckIcon from "@material-ui/icons/Done";
import {LocalLightTheme} from "../../common/components/app-theme";
import {searchAPI} from "../util/search.api";
import {ISearchResult} from "../../../../../behind/modules/search";

export interface RSSFormProps {
  onSearch: (results: ISearchResult) => any
}

@observer
export class RSSForm extends React.Component<RSSFormProps> {
  static TAGS = [
    "HorribleSubs",
    "Erai-Raws",
    "PAS",
    "Any"
  ];
  static QUALITY_RES = [
    "1080p",
    "720p",
    "480p",
    "Any"
  ];

  @observable search: string = "";
  @observable activeTag: string = "";
  @observable searchRes: string = "";

  private changeSearch(ev: React.ChangeEvent<HTMLInputElement>) {
    this.search = ev.target.value;
  }

  private applyTag(tag: string) {
    if(tag === "Any") {
      this.activeTag = "";
      return;
    }
    this.activeTag = tag;
  }

  private applyQuality(quality: string) {
    if(quality === "Any") {
      this.searchRes = "";
      return;
    }
    this.searchRes = quality;
  }

  private async callAPI(): Promise<any> {
    const constructedTerm = `${this.activeTag} ${this.search} ${this.searchRes}`.trim();
    const feeds: ISearchResult = await searchAPI(constructedTerm);

    this.props.onSearch(feeds);
  }

  public render() {
    return (
      <form className="rss-form">
        <section className="input-group">
          <TextField
            value={this.search}
            fullWidth
            onChange={(ev: any) => this.changeSearch(ev)}
            variant="filled"
            placeholder="Search for an anime to get its RSS feeds listed"
            InputProps={{
              startAdornment: <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>,
            }}
            label="RSS Feed" />
        </section>
        <MuiThemeProvider theme={LocalLightTheme}>
          <section className="search-tags-container">
            <div className="label">Sub Groups</div>
            {RSSForm.TAGS.map(tag => (
              <Chip
                clickable
                label={tag}
                className="tag"
                onClick={(ev: any) => { this.applyTag(tag); ev.stopPropagation(); }}
                deleteIcon={
                  <CheckIcon style={{ color: `${this.activeTag === tag || (this.activeTag === "" && tag === "Any") ? '#f83922' : "rgba(0, 0, 0, 0.26)"}` }} />
                }
                onDelete={(ev: any) => { this.applyTag(tag); ev.stopPropagation(); }} />
            ))}
          </section>
          <section className="search-tags-container">
            <div className="label">Quality</div>
            {RSSForm.QUALITY_RES.map(quality => (
              <Chip
                clickable
                label={quality}
                className="tag"
                onClick={(ev: any) => { this.applyQuality(quality); ev.stopPropagation(); }}
                deleteIcon={
                  <CheckIcon style={{ color: `${this.searchRes === quality || (this.searchRes === "" && quality === "Any") ? '#f83922' : "rgba(0, 0, 0, 0.26)"}` }} />
                }
                onDelete={(ev: any) => { this.applyQuality(quality); ev.stopPropagation(); }} />
            ))}
          </section>
        </MuiThemeProvider>
        <section className="submit-button-container">
          <Button variant="contained" color="secondary" onClick={() => this.callAPI()}>
            Search
          </Button>
        </section>
      </form>
    );
  }
}