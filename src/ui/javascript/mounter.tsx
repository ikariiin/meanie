import * as React from 'react';
import { render } from 'react-dom';
import {Root} from "./bundles/root/components/root";

render(
  <Root />,
  document.querySelector('[data-mount-point]')
);
