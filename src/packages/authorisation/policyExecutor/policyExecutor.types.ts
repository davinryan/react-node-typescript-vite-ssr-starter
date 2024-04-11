interface PolicyInformation {
  subject: {
    identityAssertions?: string[]   // Identities of the user
    activities?: string[]            // Activities the user has
  }
  object?: string                    // Thing you want access to
  actions: string[]                    // Activity or action (verb or predicate) thing you are trying to do

  decisionPointResults?: {
    [decision: string]: boolean
  },
  enforcementPointResults?: {
    [enforcement: string]: any
  }
}

type PolicyInformationPoint = (pip: PolicyInformation) => PolicyInformation
type PolicyDecisionPoint = (pip: PolicyInformation) => PolicyInformation
type PolicyEnforcementPoint = (pip: PolicyInformation) => PolicyInformation

type PolicyExecutor = (pip: PolicyInformation) => any

export type {
  PolicyInformation,
  PolicyInformationPoint,
  PolicyDecisionPoint,
  PolicyEnforcementPoint,
  PolicyExecutor
}