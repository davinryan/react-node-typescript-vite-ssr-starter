# Authorisation Package

## Contents

- [Getting Started](#getting-started)
- [Convenience or ready to use policy executors](#convenience-or-ready-to-use-policy-executors)
- [Overview](#overview)
- [Developer values that guide this package's development](#developer-values-that-guide-this-packages-development)
- [Available Information Points](src/informationPoints/README.md)
- [Available Decision Points](src/decisionPoints/README.md)
- [Available Enforcement Points](src/enforcementPoints/README.md)
- [Annotations/Decorators](#annotationsdecorators)

## Getting started

### Usage

```typescript
import {} from '@packages/authorisation';
```

### Build

```bash
npm run build
```

### Unit Test

```bash
npm run test:unit
```

### Publish from local

```bash
lerna publish --from-package
```

## Convenience or ready to use policy executors

These are located in src/customPolicyExectors and are provided as simple starter authorisation policy executors that
opperate
on activities.

| Policy                 | description                                                                           | inputs                                                                                                                                                        | outputs                                    |
|------------------------|---------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------|
| hasActivities          | Returns ALLOW only when all requiredActivities can be found in userActivities         | requiredActivities: string[] - all activities required for authorisation<br>userActivities: string[] - all activities belonging to a user                     | AllowDeny: stringEnum - values ALLOW, DENY |
| hasOneOrMoreActivities | Returns ALLOW only when one or more requiredActivities can be found in userActivities | requiredActivities: string[] - all activities whereby only one is required for authorisation<br>userActivities: string[] - all activities belonging to a user | AllowDeny: stringEnum - values ALLOW, DENY |

## Overview

Implementing authorisation or decision-making in an application can be hard to implement and harder to reason about.
It can result in fragments of scattered code across your service and data from multiple locations or other services like
profile data. This package attempts to centralise that implementation and lower the learning curve or entry point
to do simple and complex authorisation or policy decisions in a node.js service.

An example of an implementation using this package is below. It only marks the enforcement as true, if for a specific
action, the
user has the right activity before making an enforcement decision. E.g. what follows are OO and functional examples
depending on your style or preference

```typescript
interface PolicyInformation {
  subject: {
    identityAssertions?: string[]   // Identities of the user
    activities: string[]            // Activities the user has
  }
  object: string                    // Thing you want access to
  action: string                    // Activity or action (verb or predicate) thing you are trying to do 
}

// Policy information going into policy decision
const policyInfo: PolicyInformation = {
  subject: {
    identityAssertions: [
      'azureAD:subject:12345'
    ],
    activities: [
      'request:resource:request:create',
      'request:resource:request:re-open'
    ]
  },
  object: 'request:id:12345',
  action: 'request:resource:request:create'
};


// Policy decision and enforcement configuration
// OO implementation
const OO_ENFORCER: PolicyExecutor = new PolicyExecutorBuilder()
  .addInformationPoint(makeAccessTokenInformationPoint(accessToken))
  .addDecisionPoint(makeHasActionDecision())
  .addDecisionPoint(makeHasOneOrMoreActivities(['request:resource:request:re-open']))
  .addEnforcementPoint(makeReturnAllowDeny())
  .build();


// Functional implementation
const FUNCTIONAL_ENFORCER: PolicyExecutor = composePolicyExecutor(
  makeAccessTokenInformationPoint(getUserInfo),
  makeHasActionDecision(),
  makeHasOneOrMoreActivities(['request:resource:request:re-open']),
  makeReturnAllowDeny()
);


// Policy enforcement/execution
await OO_ENFORCER(policyInfo);
await FUNCTIONAL_ENFORCER(policyInfo);
```

Let's break this down a bit. The architecture of policies are split up into the following:

**PIP (policy information point)**
Data used to make a decision e.g. activities, access token. Has the structure

- **subject** - The person/user requesting access e.g. oAuth or Person party user
- **object** - The thing they want access to e.g. request/group/claim/quote
- **action/predicate** - What the subject wants to do with the object e.g. 'request:resource:request:create'

More: [Available Information Points](src/informationPoints/README.md)

**PDP (policy decision point)**
Rules used to describing a decision e.g. hasAction, hasActivity, hasOnOrMoreActivities

More: [Available Decision Points](src/decisionPoints/README.md)

**PEP (policy enforcement point)**
Actions, what to do when a decision or decisions are not true e.g. throw 403 Error, ignore, return ALLOW/DENY

NOTE: When using this package you do not need to do everything in one place. You may decide to make a decision but
enforce
or by relying on your own implementation somewhere else. This architecture accepts that the information, decisions and
enforcement of those decisions are not necessarily done by the same service in the same place.

More: [Available Enforcement Points](src/enforcementPoints/README.md)

## Special modifiers

### Configuration

If you need to fine tune your authorisation pipeline such as turning authZ off dynamically, there is a config
section you can add to do this. This example shows how you can disable authorisation dynamically at runtime.

```typescript
await authorise({
  config: {
    disabled: options?.ignoreAuthorisation
  },
  subject: {
    identityAssertions: ['azureAD:subject:12345']
  },
  object: 'request:id:12345',
  action: 'request:resource:request:create'
});
```

#### Possible config options

| Config Option | Description                                                                                                                                                                                                                               | Options/Configuration                                        | Notes |
|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------|-------|
| disabled      | when set to true at runtime, the policy enforcer will not run. <br/>It will immediately return a happy true case similar to if it had <br/>run and all decisions had passed. No network calls are made, <br/>no policy components are run | **Possible values**: true/false. <br/><br/>Defaults to false |       |

### ignoreIfPreviousPasses

Say you have the following enforcer

```typescript
const OO_ENFORCER: PolicyEnforcer = new PolicyExecutorBuilder()
  .addDecisionPoint(makeHasActionDecision())
  .addDecisionPoint(makeHasOneOrMoreActivities(['request:resource:request:re-open'])
    .addEnforcementPoint(makeReturnAllowDeny())
    .build();
```

and you don't want to bother running the _isOwnerDecision_ if the enforcer has already passed the
_hasActionDecision_ check. You can use the higher order function **ignoreIfPreviousPasses** to do this like
so

```typescript
const OO_ENFORCER: PolicyEnforcer = new PolicyExecutorBuilder()
  .addDecisionPoint(makeHasActionDecision())
  .addDecisionPoint(ignoreIfPreviousPasses(makeHasOneOrMoreActivities(['request:resource:request:re-open']))
    .addEnforcementPoint(makeReturnAllowDeny())
    .build();
```

This will instruct the policy enforcer to make sure that the _makeHasOneOrMoreActivities_ check is ignored if the
previous decision
_hasAction_ has already passed

### setConfigDisabled

It can get tiresome writing the following all the time when you want to control when authorisation is enabled

```typescript
await authorise({
  config: {
    disabled: options?.ignoreAuthorisation
  },
  subject: {
    identityAssertions: ['azureAD:subject:12345']
  },
  object: 'request:id:12345',
  action: 'request:resource:request:create'
});
```

Now you can write this instead and let a higher order function set it for you

```typescript
const pip: PolicyInformation = {
  subject: {
    identityAssertions: ['azureAD:subject:12345']
  },
  object: 'request:id:12345',
  action: 'request:resource:request:create'
};
const policyInfoWithConfig = setConfigDisabled(options?.ignoreAuthorisation, pip);
await authorise(policyInfoWithConfig);
```

Keep a lookout for more of these higher order functions to create declarative config pipes to build out your
policy information

## Annotations/Decorators

Yet to come, watch this space...
Possible example

```typescript
@AuthoriseByPolicy({
  executor: makeHasActivitiesEnforcer(['request:resource:request:create', 'request:resource:request:re-open'])
})
const createOrReOpenRequest = (user: UserContext, request: Request) => {
    //... 
  }
```