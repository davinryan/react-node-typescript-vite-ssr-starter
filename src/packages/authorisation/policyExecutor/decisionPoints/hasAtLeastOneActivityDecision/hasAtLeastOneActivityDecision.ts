import {PolicyDecisionPoint, PolicyInformation} from '../../policyExecutor.types'

const makeHasAtLeastOneActivityDecision = (): PolicyDecisionPoint => (policyInfo: PolicyInformation) => {
  const userActivities: string[] = policyInfo.subject?.activities ?? []
  const hasActivitiesResults: boolean[] = policyInfo.actions.map((requiredActivity: string): boolean =>
    !!userActivities.find((userActivity: string) => userActivity.trim() === requiredActivity.trim()))
  const hasAtLeastOneActivity = hasActivitiesResults.reduce((finalResult: boolean, hasActivityResult: boolean) =>
      hasActivityResult ? true : finalResult,
    false)
  return {
    ...policyInfo,
    decisionPointResults: {
      ...policyInfo.decisionPointResults,
      hasAtLeastOneActivity
    }
  }
}

export {
  makeHasAtLeastOneActivityDecision
}