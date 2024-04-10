import {PolicyEnforcementPoint, PolicyInformation} from '../../policyExecutor.types'
import {AllowDeny} from '../enforcementPoints.types'

const makeReturnAllowDeny = (): PolicyEnforcementPoint => (policyInfo: PolicyInformation): PolicyInformation => {
  const decisionPointResults: boolean[] = Object.values(policyInfo.decisionPointResults ?? {})
  const returnAllowDeny = decisionPointResults.reduce(
    (finalResult: AllowDeny, decisionPointResult: boolean) =>
      decisionPointResult ? finalResult : AllowDeny.DENY, AllowDeny.ALLOW)

  return {
    ...policyInfo,
    enforcementPointResults: {
      ...policyInfo.enforcementPointResults,
      returnAllowDeny
    }
  }
}

export {
  makeReturnAllowDeny
}
