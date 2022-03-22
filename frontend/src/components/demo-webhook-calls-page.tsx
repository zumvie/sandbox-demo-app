import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useParams } from 'react-router-dom';
import { useFetch } from 'usehooks-ts'
import { DemoWebhookStepper } from './demo-webhook-stepper';
import Box from '@mui/material/Box/Box';
import Button from '@mui/material/Button/Button';

const listDemoUrl = window.location.host.startsWith("localhost")
  ? "http://localhost:3001/api/v1/demo" 
  : "api/v1/demo";

export type Entity = {
  date: number;
  identifier: string;
  type: "Activate" | "Deactivate" | "Session";
}

export type Entities = {
  [key: string]: Entity[]
};

export default function DemoWebhookCallsPage() {
  const {demoId} = useParams<{demoId: string}>();
  const demoDataUrl = `${listDemoUrl}/${demoId}`;

  console.log("Demo data url", demoDataUrl);

  const { data } = useFetch<{items: any[]}>(demoDataUrl);

  const entities: Entities = React.useMemo(() => {
    if (!data?.items) {
      return {};
    }

    const entities: Entities = {};

    data.items.forEach(entity => {
      const accountId = entity.accountId;

      entities[accountId] = [
        ...(entities[accountId] || []),
        entity,
      ]
    });

    Object.values(entities).forEach(list => list.sort().reverse());
     
    return entities;
  }, [data]);

console.log(entities);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align="center">Steps</TableCell>
            <TableCell align="right">Details</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>

          {Object.keys(entities).map((accountId) => (
            <TableRow
              key={accountId}
            >
              <TableCell component="th" scope="row">
                {new Date(entities[accountId][0].date).toLocaleString()}
              </TableCell>

              <TableCell>
                <Box sx={{ width: '100%' }}>
                  <DemoWebhookStepper entity={entities[accountId]}/>
                </Box>
              </TableCell>

              <TableCell align="right"> 
                <Button variant="text">Details</Button>
              </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}