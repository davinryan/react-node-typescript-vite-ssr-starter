import {PolicyInformation, PolicyInformationPoint} from '../../policyExecutor.types.ts'
import {uniq} from 'ramda'

const makeWithActivitiesTokenInformation = (userActivities: string[]): PolicyInformationPoint =>
  (pip: PolicyInformation): PolicyInformation => {
    const pipUserActivities = pip.subject?.activities ?? []
    const activities: string[] = uniq([...pipUserActivities, ...userActivities])
    return {
      ...pip,
      subject: {
        ...pip.subject,
        activities
      }
    }
  }

export {
  makeWithActivitiesTokenInformation
}