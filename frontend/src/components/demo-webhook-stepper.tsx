import React from 'react';
import { Stepper, Step, StepLabel } from '@mui/material';
import { Entities, Entity } from './demo-webhook-calls-page';

export type DemoWebhookStepperProps = {
  entity: Entity[];
}

export const DemoWebhookStepper = (props: DemoWebhookStepperProps) => {

  return <Stepper activeStep={props.entity.length} alternativeLabel>
    {props.entity.map((entity) => (
      <Step key={entity.identifier}>
        <StepLabel>{entity.type}<br/>({new Date(entity.date).toLocaleString()})</StepLabel>
      </Step>
    ))}
  </Stepper>
}