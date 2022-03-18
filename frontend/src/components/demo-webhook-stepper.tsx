import React from 'react';
import { Stepper, Step, StepLabel } from '@mui/material';
import { Entities } from './demo-webhook-calls-page';

const steps = [
  'Activate Webhook',
  'Session Webhook',
  'Deactivate Webhook',
];



export type DemoWebhookStepperProps = {
  entity: Entities[keyof Entities];
}

export const DemoWebhookStepper = (props: DemoWebhookStepperProps) => {
  const activateSteps = Object.keys(props.entity).reduce((step, key) => {
    if (props.entity[key as any as keyof typeof props.entity]) {
      return step + 1;
    }
    return step;
  }, -1);

  return <Stepper activeStep={activateSteps} alternativeLabel>
    {steps.map((label) => (
      <Step key={label}>
        <StepLabel>{label}</StepLabel>
      </Step>
    ))}
  </Stepper>
}