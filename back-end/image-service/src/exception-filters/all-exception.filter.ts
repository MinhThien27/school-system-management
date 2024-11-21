import { Catch, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common';
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';

@Catch()
export class AllExceptionsFilter extends BaseRpcExceptionFilter {

    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: any, host: ArgumentsHost) {
        if (exception instanceof RpcException) {
            return super.catch(exception, host);
        }
        const statusCode = exception.statusCode ? exception.statusCode : HttpStatus.INTERNAL_SERVER_ERROR;
        const message = exception.message ? exception.message : 'Internal Server Error';
        const rpcException = new RpcException({ message, statusCode });
        this.logger.error(rpcException);
        return super.catch(rpcException, host);
    }
}