import { createMachine } from 'xstate'
import type { GatewayCredentials } from '~/interfaces/deconz'

export interface GatewayMachineContext {
  credentials: GatewayCredentials
}

export type GatewayMachineEvent = | {
  type: 'TOOGLE'
  value: 'active' | 'inactive' | string
}

/** @xstate-layout N4IgpgJg5mDOIC5QBcD2UoBswDoCWAdgIYDGyeAbmAMQAqA8gOKMAyAogNoAMAuoqAAdUsPOVQF+IAB6IAjADZ5AGhABPOQA4A7AF8dKtBmw5S5KnSatOvSUJFiJSaXK1cV6hAFpZXHAFY9fRACVAg4SUMsMFthUTxxSRkvACY3NURPAE4NPQN0KPxiMkpopzs4hKck5I13RD8-fw0AZla29tbckEjjUxKY+3jHUGrM32bZZL86hDGcLhaOpcCdIA */
export const createGatewayMachine = (credentials: GatewayCredentials) => createMachine({
  id: `gateway-${credentials.id}`,
  initial: 'inactive',
  schema: {
    context: {} as GatewayMachineContext,
    events: {} as GatewayMachineEvent,
  },
  tsTypes: {} as import('./createGatewayMachine.typegen').Typegen0,
  // For V5
  preserveActionOrder: true,
  context: {
    credentials,
  },
  states: {
    inactive: {
      on: { TOGGLE: 'active' },
    },
    active: {
      on: { TOGGLE: 'inactive' },
    },
  },
})
