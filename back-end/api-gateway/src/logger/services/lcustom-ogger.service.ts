// import { ConsoleLogger, Injectable, Scope } from "@nestjs/common";
// import { format } from "date-fns";
// import { v4 as uuid } from "uuid";
// import * as fs from "fs";
// import * as path from "path";
// import { Request } from "express";

// @Injectable({ scope: Scope.TRANSIENT })
// export class CustomLogger extends ConsoleLogger {

//     async logEvents(message: string, logFileName: string): Promise<void> {
//         const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
//         const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
    
//         const fsPromises = fs.promises;

//         try {
//             if (!fs.existsSync(path.join(__dirname, '..', '..', 'logs'))) {
//                 await fsPromises.mkdir(path.join(__dirname, '..', '..', 'logs'));
//             }
//             await fsPromises.appendFile(path.join(__dirname, '..', '..', 'logs', logFileName), logItem);
//         } catch (err) {
//             console.log(err);
//         }
//     }

//     requestLog(req: Request): void {
//         this.logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'req.log');
//         console.log(`${req.method} ${req.path}`);
//     }

//     exceptionLog(err: any): void {
//         this.logEvents(`${err.name}: ${err.message}`, 'err.log');
//     }

//     httpExceptionLog(req: Request, err: any): void {
//         this.logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'http-exceptions.log');
//     }
// }