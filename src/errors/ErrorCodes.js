/** Returns an error code object for error handling. */
class ErrorCode {
    constructor(status, message) { this.status = status, this.message = message }
}

module.exports = ErrorCode