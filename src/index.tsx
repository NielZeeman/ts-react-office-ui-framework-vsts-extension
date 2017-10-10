import * as React from "react";
import * as ReactDOM from "react-dom";

import { WorkItemList } from "./components/WorkItemlist";

export function init(containerId: string): void {
    ReactDOM.render(<WorkItemList />, document.getElementById(containerId));
}
