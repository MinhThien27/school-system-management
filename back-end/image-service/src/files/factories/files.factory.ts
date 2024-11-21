import { Injectable } from "@nestjs/common";
import { join } from "path";
import { MediaType } from "../enums/media-type.enum";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class FilesFactory {

    constructor(private readonly configService: ConfigService) {}

    createFilePath(folderPath: string, fileName: string): string {
        return join(folderPath, fileName);
    }

    createFolderPath(mediaType: MediaType, folderName?: string): string {
        return join(__dirname, '..', '..', '..', 'public', mediaType + 's', folderName);
    }

    createFileUrl(filePath: string): string {
        const parts = filePath.replace(/\\/g, '/').split('public');
        return `${this.configService.get<string>('SERVER_URL')}${parts[1]}`;
    }

    createFileNameFromUrl(fileUrl: string): string {
        if (!fileUrl) return '';
        const urlParts = fileUrl.split('/');
        return urlParts[urlParts.length - 1];
    }
}