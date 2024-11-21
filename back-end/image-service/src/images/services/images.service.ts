import { Injectable } from "@nestjs/common";
import { MediaType } from "src/files/enums/media-type.enum";
import { FilesService } from "src/files/services/files.service";

@Injectable()
export class ImagesService {

    constructor(private readonly filesService: FilesService) {}

    saveStudentImage(image: Express.Multer.File): string {
        return this.filesService.saveFile(MediaType.Image, image, 'student-images');
    }

    deleteStudentImage(imageUrl: string) {
        return this.filesService.deleteFile(MediaType.Image, imageUrl, 'student-images');
    }

    saveTeacherImage(image: Express.Multer.File): string {
        return this.filesService.saveFile(MediaType.Image, image, 'teacher-images');
    }

    deleteTeacherImage(imageUrl: string) {
        return this.filesService.deleteFile(MediaType.Image, imageUrl, 'teacher-images');
    }
}