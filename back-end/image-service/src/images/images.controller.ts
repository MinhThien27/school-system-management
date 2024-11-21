import { Controller, UseFilters } from "@nestjs/common";
import { ImagesService } from "./services/images.service";
import { EventPattern, MessagePattern, Payload } from "@nestjs/microservices";
import { AllExceptionsFilter } from "src/exception-filters";

@Controller()
@UseFilters(AllExceptionsFilter)
export class ImagesController {

    constructor(private readonly imagesService: ImagesService) {}

    @MessagePattern({ cmd: 'save-student-image' })
    async saveStudentImage(@Payload() image: Express.Multer.File) {
        return this.imagesService.saveStudentImage(image);
    }

    @EventPattern('delete-student-image')
    deleteStudentImage(imageUrl: string) {
        return this.imagesService.deleteStudentImage(imageUrl);
    }

    @MessagePattern({ cmd: 'save-teacher-image' })
    async saveTeacherImage(@Payload() image: Express.Multer.File) {
        return this.imagesService.saveTeacherImage(image);
    }

    @EventPattern('delete-teacher-image')
    deleteTeacherImage(imageUrl: string) {
        return this.imagesService.deleteTeacherImage(imageUrl);
    }
}