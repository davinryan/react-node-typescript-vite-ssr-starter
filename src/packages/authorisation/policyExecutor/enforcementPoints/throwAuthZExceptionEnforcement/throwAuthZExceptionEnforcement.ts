import {PolicyEnforcementPoint, PolicyInformation} from '../../policyExecutor.types'
import {AuthZException} from './AuthZException'
import {forEachObjIndexed} from 'ramda'
import {AllowDeny} from '../enforcementPoints.types'

const makeThrowAuthZExceptionEnforcement = (): PolicyEnforcementPoint => (policyInfo: PolicyInformation): PolicyInformation => {
  const failedDecisions: string[] = []

  forEachObjIndexed((value: boolean, key: string | number) => {
    if (!value) {
      failedDecisions.push('' + key)
    }
  }, policyInfo?.decisionPointResults ?? {})

  if (failedDecisions.length > 0) {
    throw new AuthZException(failedDecisions)
  }
  return {
    ...policyInfo,
    enforcementPointResults: {
      ...policyInfo.enforcementPointResults,
      throwAuthZException: AllowDeny.ALLOW
    }
  }
}

export {
  makeThrowAuthZExceptionEnforcement
}