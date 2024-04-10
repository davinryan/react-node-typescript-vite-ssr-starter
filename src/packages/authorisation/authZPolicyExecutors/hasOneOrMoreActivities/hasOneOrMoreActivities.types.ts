import {AllowDeny} from '../../policyExecutor'

type HasOneOrMoreActivitiesPolicyExecutor = (requiredActivities: string[], userActivities: string[]) => AllowDeny

export type {
  HasOneOrMoreActivitiesPolicyExecutor
}