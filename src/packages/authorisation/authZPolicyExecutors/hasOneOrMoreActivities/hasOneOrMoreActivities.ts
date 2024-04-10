import {HasOneOrMoreActivitiesPolicyExecutor} from './hasOneOrMoreActivities.types'
import {makeHasAtLeastOneActivityDecision, makeReturnAllowDeny, PolicyExecutorBuilder} from '../../policyExecutor'

const hasOneOrMoreActivitiesPolicyExecutor = PolicyExecutorBuilder
  .make()
  .addDecisionPoint(makeHasAtLeastOneActivityDecision())
  .addEnforcementPoint(makeReturnAllowDeny())
  .build()
const hasOneOrMoreActivities: HasOneOrMoreActivitiesPolicyExecutor = (requiredActivities: string[], userActivities: string[]) =>
  hasOneOrMoreActivitiesPolicyExecutor({
    subject: {
      activities: userActivities
    },
    actions: requiredActivities
  })

export {
  hasOneOrMoreActivities
}