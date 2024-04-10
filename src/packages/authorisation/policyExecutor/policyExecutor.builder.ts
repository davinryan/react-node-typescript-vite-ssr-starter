import {
  PolicyDecisionPoint,
  PolicyEnforcementPoint,
  PolicyExecutor,
  PolicyInformation,
  PolicyInformationPoint
} from './policyExecutor.types'

class PolicyExecutorBuilder {

  private informationPoints: PolicyInformationPoint[] = []
  private decisionPoints: PolicyDecisionPoint[] = []
  private enforcementPoints: PolicyEnforcementPoint[] = []

  private constructor() {
  }

  public static make() {
    return new PolicyExecutorBuilder()
  }

  public addInformationPoint(informationPoint: PolicyInformationPoint) {
    this.informationPoints.push(informationPoint)
    return this
  }

  public addDecisionPoint(decisionPoint: PolicyDecisionPoint) {
    this.decisionPoints.push(decisionPoint)
    return this
  }

  public addEnforcementPoint(enforcementPoint: PolicyEnforcementPoint) {
    this.enforcementPoints.push(enforcementPoint)
    return this
  }

  public build(): PolicyExecutor {
    // this order matters and indicates the order these should be processed
    const points = [...this.informationPoints, ...this.decisionPoints, ...this.enforcementPoints]

    return (policyInfo: PolicyInformation): any => {
      const processedPolicyInfo: PolicyInformation = points.reduce((accResult: PolicyInformation, point: PolicyInformationPoint | PolicyDecisionPoint | PolicyEnforcementPoint) => point(accResult), policyInfo)
      const enforcementPointResults = Object.values(processedPolicyInfo?.enforcementPointResults ?? {})
      //  return first enforcement that has a value
      return enforcementPointResults.find((result: any) => !!result)
    }
  }
}

export {
  PolicyExecutorBuilder
}
