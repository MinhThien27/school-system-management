import { Injectable } from "@nestjs/common";
import { FilesFactory } from "../factories/files.factory";
import { MediaType } from "../enums/media-type.enum";
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from "fs";
import { RpcException } from "@nestjs/microservices";

@Injectable()
export class FilesService {

    constructor(private readonly filesFactory: FilesFactory) {}

    saveFile(mediaType: MediaType, file: Express.Multer.File, folderName?: string): string {
        const folderPath = this.filesFactory.createFolderPath(mediaType, folderName);
        const filePath = this.filesFactory.createFilePath(folderPath, file.originalname);
        this.createFolder(folderPath);
        console.log({folderPath, filePath, file});
        writeFileSync(filePath, Buffer.from(file.buffer));
        return this.filesFactory.createFileUrl(filePath);
    }

    deleteFile(mediaType: MediaType, fileUrl: string, folderName?: string): void {
        const fileName = this.filesFactory.createFileNameFromUrl(fileUrl);
        const folderPath = this.filesFactory.createFolderPath(mediaType, folderName);
        const filePath = this.filesFactory.createFilePath(folderPath, fileName);
        console.log({fileName, folderPath, filePath});
        if (existsSync(filePath)) {
            unlinkSync(filePath);
        } else {
            throw new RpcException('File path do not exist');
        }
    }

    createFolder(folderPath: string): void {
        if (!existsSync(folderPath)) {
            mkdirSync(folderPath, { recursive: true });
        } 
    }
}