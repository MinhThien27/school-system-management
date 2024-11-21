import { HttpStatus } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

export class UnauthorizedRpcException extends RpcException {
    constructor(message?: string) {
        const errorMessage = message ? message : 'Unauthorized';
        const statusCode = HttpStatus.UNAUTHORIZED;
        super({ message: errorMessage, statusCode });
    }
}