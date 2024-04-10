class AuthZException extends Error {

  constructor(failedDecisions: string[]) {
    const message: string = failedDecisions.reduce((acc: string, currentValue: string, index: number) => {
      const message = acc.concat(`${currentValue}`)
      return index < failedDecisions.length - 1 ? message.concat(', ') : message.concat('.')
    }, 'Failed because the following assertions were false ')
    super(message)
  }
}

export {
  AuthZException
}