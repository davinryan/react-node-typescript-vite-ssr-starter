import {HasActivitiesPolicyExecutor} from './hasActivities.types.ts'
import {makeHasActionsDecision, makeReturnAllowDeny, PolicyExecutorBuilder} from '../../policyExecutor'

const hasActivitiesPolicyExecutor = PolicyExecutorBuilder
  .make()
  .addDecisionPoint(makeHasActionsDecision())
  .addEnforcementPoint(makeReturnAllowDeny())
  .build()
const hasActivities: HasActivitiesPolicyExecutor = (requiredActivities: string[], userActivities: string[]) =>
  hasActivitiesPolicyExecutor({
    subject: {
      activities: userActivities
    },
    actions: requiredActivities
  })

export {
  hasActivities
}