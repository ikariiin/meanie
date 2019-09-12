import * as React from 'react';
import {FilledInput, FormControl, InputAdornment, InputLabel, MenuItem, Select} from "@material-ui/core";
import "../../scss/management/sort.scss";
import {SortParams} from "../activities-manage-bar";
import SortIcon from "@material-ui/icons/Sort";

export interface SortProps {
  activeParam: SortParams;
  onChange: (sortBy: any) => void;
}

export const Sort: React.FunctionComponent<SortProps> = ({onChange, activeParam}): JSX.Element => (
  <section className="sort-container">
    <FormControl fullWidth variant="filled">
      <InputLabel>Sort By</InputLabel>
      <Select
        variant="filled"
        input={<FilledInput startAdornment={
          <InputAdornment position="start">
            <SortIcon />
          </InputAdornment>
        } />}
        value={activeParam}
        onChange={(parameter) => onChange(parameter.target.value)}
      >
        {Object.values(SortParams).filter(param => typeof param === "string").map(parameter => (
          <MenuItem value={SortParams[parameter]}>{parameter}</MenuItem>
        ))}
      </Select>
    </FormControl>
  </section>
);