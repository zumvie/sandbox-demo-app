import * as React from "react";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import { WhoamiResponse } from "./demo-webhook-calls-page";
import ReactJson from "react-json-view";

export const MainListItems = (props: { data?: WhoamiResponse }) => {
  console.log(props.data);

  const [displayNoneButton, setDisplayNoneButtonRef] =
    React.useState<HTMLButtonElement | null>();
  const [disableButton, setDisableButtonRef] =
    React.useState<HTMLButtonElement | null>();

  const [displayNoneTest, setDisplayNoneTest] = React.useState(false);
  const [disableTest, setDisableTest] = React.useState(false);

  React.useEffect(() => {
    if (!displayNoneButton || !disableButton) {
      return;
    }

    setDisplayNoneTest(displayNoneButton.style.display === "none");
    setDisableTest(disableButton.disabled);

    const intervalId = setInterval(() => {
      setDisplayNoneTest(displayNoneButton.style.display === "none");
      setDisableTest(disableButton.disabled);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [displayNoneButton, disableButton, displayNoneTest, disableTest]);

  return (
    <React.Fragment>
      <WhoAmIList data={props.data} />

      <ListSubheader component="div" sx={{ position: "relative" }}>
        Actionable Selectors
      </ListSubheader>

      <div>
        <p>.display-none-class - {displayNoneTest ? "PASS" : "FAIL"}</p>
        <button ref={setDisplayNoneButtonRef} className="display-none-class">
          Display None
        </button>
        <br />
        <p>.disable-class - {disableTest ? "PASS" : "FAIL"}</p>
        <button ref={setDisableButtonRef} className="disable-class">
          Disable
        </button>
        <div>
            <p>Testing iframe window objects</p>
            <p id="title">Root Iframe Parent</p>
          <iframe height="400px" scrolling="no" style={{overflow: "hidden"}} src="/level-0.html"></iframe>
        </div>
      </div>
    </React.Fragment>
  );
};

const WhoAmIList = (props: { data?: WhoamiResponse }) => {
  if (!props.data) {
    return <p>No loaded!</p>;
  }

  const localStorageItems = JSON.parse(JSON.stringify(localStorage || {}));
  const cookies = props.data.cookies;
  const headers = props.data.headers || {};

  return (
    <>
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
    </>
  );
};
