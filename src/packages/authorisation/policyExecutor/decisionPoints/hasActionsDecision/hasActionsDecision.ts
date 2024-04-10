import {PolicyDecisionPoint, PolicyInformation} from '../../policyExecutor.types'

const makeHasActionsDecision = (): PolicyDecisionPoint => (policyInfo: PolicyInformation) => {
  const userActivities: string[] = policyInfo.subject?.activities ?? []
  const hasActivitiesResults: boolean[] = policyInfo.actions.map((requiredActivity: string): boolean =>
    !!userActivities.find((userActivity: string) => userActivity.trim() === requiredActivity.trim()))
  const hasActions = hasActivitiesResults.reduce((finalResult: boolean, hasActivityResult: boolean) =>
      hasActivityResult ? finalResult : false,
    true)
  return {
    ...policyInfo,
    decisionPointResults: {
      ...policyInfo.decisionPointResults,
      hasActions
    }
  }
}

export {
  makeHasActionsDecision
}
