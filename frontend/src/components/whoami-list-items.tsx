import * as React from "react";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import { WhoamiResponse } from "./demo-webhook-calls-page";
import { maxWidth } from "@mui/system";
import ReactJson from "react-json-view";

export const MainListItems = (props: { data?: WhoamiResponse }) => {
  console.log(props.data);

  if (!props.data) {
    return <p>No loaded!</p>;
  }

  const localStorageItems = JSON.parse(JSON.stringify(localStorage || {}));
  const cookies = props.data.cookies;
  const headers = props.data.headers || {};

  console.log(headers);

  return (
    <React.Fragment>
      <ListSubheader component="div" sx={{ position: "relative" }}>
        Status
      </ListSubheader>
      <ListItemText primary={props.data?.status} sx={{ paddingLeft: 2 }} />

      <ListSubheader component="div" sx={{ position: "relative" }}>
        Cookies
      </ListSubheader>

      <ReactJson
        src={cookies}
        name={null}
        indentWidth={2}
        collapsed={true}
        displayDataTypes={false}
        enableClipboard={false}
      />
      <ListSubheader component="div" sx={{ position: "relative" }}>
        Local Storage
      </ListSubheader>

      <ReactJson
        src={localStorageItems}
        name={null}
        indentWidth={2}
        collapsed={true}
        displayDataTypes={false}
        enableClipboard={false}
      />

      <ListSubheader component="div" sx={{ position: "relative" }}>
        Headers
      </ListSubheader>

      <ReactJson
        src={headers}
        name={null}
        indentWidth={2}
        collapsed={true}
        displayDataTypes={false}
        enableClipboard={false}
      />
    </React.Fragment>
  );
};
