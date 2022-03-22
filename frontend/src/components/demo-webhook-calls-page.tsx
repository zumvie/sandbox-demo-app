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

const listDemoUrl = "/api/v1/demo";

export type Entities = {
  [key: string]: {
    Activate: any,
    Session: any,
    Deactivate: any,
  }
};

export default function DemoWebhookCallsPage() {
  const {demoId} = useParams<{demoId: string}>();
  console.log(demoId);

  const { data, error } = useFetch<{items: any[]}>(`${listDemoUrl}/${demoId}`);
  console.log(data);

  const entities: Entities = React.useMemo(() => {
    if (!data?.items) {
      return {};
    }

    const entities: Entities = {};

    data.items.forEach(entity => {
      const accountId = entity.accountId;

      entities[accountId] = {
        ...entities[accountId],
        [entity.type]: entity,
      }
    });
     
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
                {new Date(entities[accountId].Activate.date).toLocaleString()}
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