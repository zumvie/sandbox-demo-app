import React from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Tooltip,
  Box,
  Button,
  Typography,
} from "@mui/material";
import { Entities, Entity } from "./demo-webhook-calls-page";
import StepContent from "@mui/material/StepContent";
import ReactJson from "react-json-view";

export type DemoWebhookStepperProps = {
  entity: Entity[];
};

export const DemoWebhookStepper = (props: DemoWebhookStepperProps) => {
  return (
    <Stepper alternativeLabel>
      {props.entity.map((entity) => (
        <Step key={entity.identifier} active={true}>
          <StepLabel>
            {entity.type}
            <br />({new Date(entity.date).toLocaleString()})
          </StepLabel>
          <StepContent>
            <ReactJson
              src={entity}
              name={null}
              indentWidth={2}
              collapsed={true}
              displayDataTypes={false}
              enableClipboard={false}
            />
          </StepContent>
        </Step>
      ))}
    </Stepper>
  );
};
