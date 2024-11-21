export class SagaCompensationFailed extends Error {
    originalError: Error;

    constructor(error: Error) {
        super(error.message);
        this.stack = error.stack;
        this.originalError = error;
    }
}