import { HttpStatus } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

export class RequestTimeoutRpcException extends RpcException {
    constructor(message?: string) {
        const errorMessage = message ? message : 'Request Timeout';
        const statusCode = HttpStatus.REQUEST_TIMEOUT;
        super({ message: errorMessage, statusCode });
    }
}