
import {hasActivities} from './hasActivities'
import {AllowDeny} from '../../policyExecutor'

describe('hasActivities test suite', () => {

  it('should allow when user has policy:resource:episodes:read exists', () => {
    // Setup
    const userActivities: string[] = ['claims:resource:claims:read', 'policy:resource:episodes:read']

    // Test & Verify
    expect(hasActivities(['policy:resource:episodes:read'], userActivities)).toEqual(AllowDeny.ALLOW)
  })

  it('should deny when user does not have policy:resource:episodes:read', () => {
    // Setup
    const userActivities: string[] = ['claims:resource:claims:read']

    // Test & Verify
    expect(hasActivities(['policy:resource:episodes:read'], userActivities)).toEqual(AllowDeny.DENY)
  })

  it('should allow ONLY when user has both policy:resource:episodes:read and claims:resource:claims:read', () => {
    // Setup
    const userActivities: string[] = ['claims:resource:claims:read', 'policy:resource:episodes:read']

    // Test & Verify
    expect(hasActivities(['claims:resource:claims:read', 'policy:resource:episodes:read'], userActivities)).toEqual(AllowDeny.ALLOW)
  })

  it('should deny when user has ONLY one of policy:resource:episodes:read or claims:resource:claims:read', () => {
    // Setup
    const userActivities: string[] = ['claims:resource:claims:read']

    // Test & Verify
    expect(hasActivities(['claims:resource:claims:read', 'policy:resource:episodes:read'], userActivities)).toEqual(AllowDeny.DENY)
  })
})
