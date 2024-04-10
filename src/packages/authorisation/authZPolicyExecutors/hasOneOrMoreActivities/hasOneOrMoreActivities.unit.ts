import {hasOneOrMoreActivities} from './hasOneOrMoreActivities'
import {AllowDeny} from '../../policyExecutor'

describe('hasOneOrMoreActivities test suite', () => {

  it('should allow when user has policy:resource:episodes:read exists', () => {
    // Setup
    const userActivities: string[] = ['claims:resource:claims:read', 'policy:resource:episodes:read']

    // Test & Verify
    expect(hasOneOrMoreActivities(['policy:resource:episodes:read'], userActivities)).toEqual(AllowDeny.ALLOW)
  })

  it('should deny when user does not have policy:resource:episodes:read', () => {
    // Setup
    const userActivities: string[] = ['claims:resource:claims:read']

    // Test & Verify
    expect(hasOneOrMoreActivities(['policy:resource:episodes:read'], userActivities)).toEqual(AllowDeny.DENY)
  })

  it('should allow ONLY when user has one of policy:resource:episodes:read or claims:resource:claims:read', () => {
    // Setup
    const user1Activities: string[] = ['claims:resource:claims:read', 'policy:resource:episodes:read']
    const user2Activities: string[] = ['claims:resource:claims:read']

    // Test & Verify
    expect(hasOneOrMoreActivities(['claims:resource:claims:read'], user1Activities)).toEqual(AllowDeny.ALLOW)
    expect(hasOneOrMoreActivities(['claims:resource:claims:read'], user2Activities)).toEqual(AllowDeny.ALLOW)
  })

  it('should deny when user has NONE of policy:resource:episodes:read or claims:resource:claims:read', () => {
    // Setup
    const userActivities: string[] = ['some:other:activity:read']

    // Test & Verify
    expect(hasOneOrMoreActivities(['claims:resource:claims:read', 'policy:resource:episodes:read'], userActivities)).toEqual(AllowDeny.DENY)
  })
})