import { Module } from "@nestjs/common";
import { ImagesController } from "./images.controller";
import { ImagesService } from "./services/images.service";
import { FilesModule } from "src/files/files.module";

@Module({
    imports: [FilesModule],
    controllers: [ImagesController],
    providers: [ImagesService]
})
export class ImagesModule {}