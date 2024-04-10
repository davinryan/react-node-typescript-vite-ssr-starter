import {AllowDeny} from '../../policyExecutor/enforcementPoints'

type HasActivitiesPolicyExecutor = (requiredActivities: string[], userActivities: string[]) => AllowDeny

export type {
  HasActivitiesPolicyExecutor
}