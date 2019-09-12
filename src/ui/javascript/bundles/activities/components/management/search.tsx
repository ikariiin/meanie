import * as React from 'react';
import {InputAdornment, TextField} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import "../../scss/management/search.scss";

export interface SearchProps {
  onChange: (term: string) => void;
  currentSearch: string;
}

export const Search: React.FunctionComponent<SearchProps> = ({onChange, currentSearch}): JSX.Element => (
  <section className="search-container">
    <TextField
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        )
      }}
      value={currentSearch}
      variant="filled"
      onChange={(event) => onChange(event.target.value)}
      label="Search"
      fullWidth
      placeholder="Search for past or current downloads"
    />
  </section>
);