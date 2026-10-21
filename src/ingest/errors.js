// `code` tells the UI which Hebrew text to show. `message` is for developers.
export class ParseError extends Error {
  constructor(code, message, params = {}) {
    super(message)
    this.name = 'ParseError'
    this.code = code
    this.params = params
  }
}
