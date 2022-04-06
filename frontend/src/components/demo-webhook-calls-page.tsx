import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useParams } from "react-router-dom";
import { useFetch } from "usehooks-ts";
import { DemoWebhookStepper } from "./demo-webhook-stepper";
import Box from "@mui/material/Box/Box";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { MainListItems } from "./whoami-list-items";

import { Drawer } from "./components.styled";
import { Toolbar, IconButton, Divider, List } from "@mui/material";

const listDemoUrl = window.location.host.startsWith("localhost")
  ? "http://localhost:3001/api/v1/demo"
  : "/api/v1/demo";

const whoamiUrl = window.location.host.startsWith("localhost")
  ? "http://localhost:3001/api/v1/whoami"
  : "/api/v1/whoami";

export type WhoamiResponse = {
  status: "User found";
  demoId: string;
  accountId: string;
  headers: { [key: string]: string };
  cookies: { [key: string]: string };
  entities: Entity[];
};

export type Entity = {
  date: number;
  identifier: string;
  type: "Activate" | "Deactivate" | "Session";
};

export type Entities = {
  [key: string]: Entity[];
};

export default function DemoWebhookCallsPage() {
  const { demoId } = useParams<{ demoId: string }>();
  const demoDataUrl = `${listDemoUrl}/${demoId}`;
  const [open, setOpen] = React.useState(true);

  console.log("Demo data url", demoDataUrl);

  const { data } = useFetch<{ items: any[] }>(demoDataUrl);

  const { data: whoamiData } = useFetch<WhoamiResponse>(whoamiUrl);

  const entities: Entities = React.useMemo(() => {
    if (!data?.items) {
      return {};
    }

    const entities: Entities = {};

    data.items.forEach((entity) => {
      const accountId = entity.accountId;

      entities[accountId] = [...(entities[accountId] || []), entity];
    });

    Object.values(entities).forEach((list) => list.sort().reverse());

    return entities;
  }, [data]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      <Drawer variant="permanent" open={open}>
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: [1],
          }}
        >
          Who Am I ?
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List
          sx={{
            overflow: "scroll",
            width: "400px",
            height: "100%",
            paddingLeft: 4,
          }}
        >
          <MainListItems data={whoamiData} />
        </List>
      </Drawer>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">
                Webhook Calls For Seperate Accounts
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(entities).map((accountId) => (
              <TableRow
                key={accountId}
                sx={{
                  backgroundColor:
                    accountId === whoamiData?.accountId ? "green" : undefined,
                }}
              >
                <TableCell>
                  <Box sx={{ width: "100%" }}>
                    <DemoWebhookStepper entity={entities[accountId]} />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
