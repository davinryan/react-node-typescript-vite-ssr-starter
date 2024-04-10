import {PolicyExecutor, PolicyInformation} from './policyExecutor.types'
import {PolicyExecutorBuilder} from './policyExecutor.builder'
import {makeHasActionsDecision, makeHasAtLeastOneActivityDecision} from './decisionPoints'
import {AllowDeny, makeReturnAllowDeny, makeThrowAuthZExceptionEnforcement} from './enforcementsPoints'
import {makeWithActivitiesInformation} from './informationPoints'

describe('Policy Executor test suite', () => {

  describe('hasActions test suite', () => {

    const authoriseUserForActivity: PolicyExecutor = PolicyExecutorBuilder.make()
      .addDecisionPoint(makeHasActionsDecision())
      .addEnforcementPoint(makeReturnAllowDeny())
      .build()

    it('hasActivity: should allow when activity exists', () => {
      // Setup
      const policyInfo: PolicyInformation = {
        subject: {
          activities: [
            'request:resource:request:create',
            'request:resource:request:re-open'
          ]
        },
        actions: ['request:resource:request:re-open']
      }

      // Test & Verify
      expect(authoriseUserForActivity(policyInfo)).toEqual(AllowDeny.ALLOW)
    })

    it('hasActions: should deny when activity does not exist', () => {
      // Setup
      const policyInfo: PolicyInformation = {
        subject: {
          activities: [
            'request:resource:request:create'
          ]
        },
        actions: ['request:resource:request:re-open']
      }


      // Test & Verify
      expect(authoriseUserForActivity(policyInfo)).toEqual(AllowDeny.DENY)
    })
  })

  describe('hasOneOrMoreActivities test suite', () => {
    const authoriseUserForActivities: PolicyExecutor = PolicyExecutorBuilder.make()
      .addDecisionPoint(makeHasActionsDecision())
      .addEnforcementPoint(makeReturnAllowDeny())
      .build()

    it('hasOneOrMoreActivities: should allow when all actions exist', () => {
      // Setup
      const policyInfo: PolicyInformation = {
        subject: {
          activities: [
            'request:resource:request:create',
            'request:resource:request:re-open'
          ]
        },
        actions: ['request:resource:request:re-open', 'request:resource:request:create']
      }


      // Test & Verify
      expect(authoriseUserForActivities(policyInfo)).toEqual(AllowDeny.ALLOW)
    })

    it('hasOneOrMoreActivities: should deny when some activities are missing', () => {
      // Setup
      const policyInfo: PolicyInformation = {
        subject: {
          activities: []
        },
        actions: ['request:resource:request:re-open']
      }


      // Test & Verify
      expect(authoriseUserForActivities(policyInfo)).toEqual(AllowDeny.DENY)
    })
  })

  describe('hasAtLeastOneActivity test suite', () => {
    const authoriseUserForAtLeastOneOrMoreActivities: PolicyExecutor = PolicyExecutorBuilder.make()
      .addDecisionPoint(makeHasAtLeastOneActivityDecision())
      .addEnforcementPoint(makeReturnAllowDeny())
      .build()

    it('hasOneOrMoreActivities: should allow when at least one activity exists', () => {
      // Setup
      const policyInfo: PolicyInformation = {
        subject: {
          activities: [
            'request:resource:request:create',
            'request:resource:request:re-open'
          ]
        },
        actions: ['request:resource:request:re-open']
      }


      // Test & Verify
      expect(authoriseUserForAtLeastOneOrMoreActivities(policyInfo)).toEqual(AllowDeny.ALLOW)
    })

    it('hasOneOrMoreActivities: should deny when no activities exist', () => {
      // Setup
      const policyInfo: PolicyInformation = {
        subject: {
          activities: []
        },
        actions: ['request:resource:request:re-open']
      }


      // Test & Verify
      expect(authoriseUserForAtLeastOneOrMoreActivities(policyInfo)).toEqual(AllowDeny.DENY)
    })
  })

  describe('withActivitiesInformation test suite', () => {
    const activitiesForSubject: string[] = ['claims:resource:claims:read', 'policy:resource:episodes:read']
    const authorise: PolicyExecutor = PolicyExecutorBuilder.make()
      .addInformationPoint(makeWithActivitiesInformation(activitiesForSubject))
      .addDecisionPoint(makeHasActionsDecision())
      .addEnforcementPoint(makeReturnAllowDeny())
      .build()

    it('withActivitiesInformation: should allow when activity policy:resource:episodes:read exists', () => {
      // Setup
      const policyInfo: PolicyInformation = {
        subject: {},
        actions: ['policy:resource:episodes:read']
      }


      // Test & Verify
      expect(authorise(policyInfo)).toEqual(AllowDeny.ALLOW)
    })

    it('withActivitiesInformation: should deny when activity does not exist', () => {
      // Setup
      const policyInfo: PolicyInformation = {
        subject: {},
        actions: ['totally:resource:madeUp:activity']
      }


      // Test & Verify
      expect(authorise(policyInfo)).toEqual(AllowDeny.DENY)
    })
  })

  describe('throwAuthZExcpetionEnforcement test suite', () => {
    const authorise: PolicyExecutor = PolicyExecutorBuilder.make()
      .addDecisionPoint(makeHasActionsDecision())
      .addEnforcementPoint(makeThrowAuthZExceptionEnforcement())
      .build()

    it('withActivitiesInformation: should allow when activity policy:resource:episodes:read exists', () => {
      // Setup
      const policyInfo: PolicyInformation = {
        subject: {
          activities: ['policy:resource:episodes:read']
        },
        actions: ['policy:resource:episodes:read']
      }


      // Test & Verify
      expect(authorise(policyInfo)).toEqual(AllowDeny.ALLOW)
    })

    it('withActivitiesInformation: should deny when activity does not exist', () => {
      // Setup
      const policyInfo: PolicyInformation = {
        subject: {
          activities: []
        },
        actions: ['policy:resource:episodes:read']
      }


      // Test & Verify
      try {
        authorise(policyInfo)
      } catch (error: any) {
        expect(error.message).toEqual('Failed because the following assertions were false hasActions.')
      }
    })
  })
})