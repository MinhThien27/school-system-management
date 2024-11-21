import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { Response } from "express";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter<any> {

    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: any, host: ArgumentsHost) {
        console.error(exception)
        const context = host.switchToHttp();
        const response = context.getResponse<Response>();

        if (exception instanceof HttpException) {
            return response
                .status(exception.getStatus())
                .json(exception.getResponse());
        }

        const statusCode = exception.statusCode ? exception.statusCode : HttpStatus.INTERNAL_SERVER_ERROR;
        const message = exception.message ? exception.message : 'Internal Server Error';
        this.logger.error(exception);
        return response
            .status(statusCode)
            .json({
                statusCode,
                message
            });
    }
}