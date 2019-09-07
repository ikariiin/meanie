import * as React from 'react';
import {Button} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import "../scss/accept-result-footer.scss";
import {submitFeed} from "../util/feed-submit.api";

export interface AcceptResultFooterProps {
  url: string;
}

function handleSubmission(url: string) {
  submitFeed(url);
}

export const AcceptResultFooter: React.FunctionComponent<AcceptResultFooterProps> = ({url}: AcceptResultFooterProps): JSX.Element => (
  <section className="accept-result-footer">
    <div className="text">
      <div className="icon">
        <AddIcon style={{ fontSize: "inherit" }} />
      </div>
      Add this feed to your regular downloads?
    </div>
    <Button variant="contained" color="secondary" size="large" onClick={() => handleSubmission(url)}>
      Add
    </Button>
  </section>
);