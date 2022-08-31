import { Injectable, BadRequestException } from "@nestjs/common";
import { isUUID } from "class-validator";

@Injectable()
export class UUIDCheckPipe {
    transform(uuid) {
        if (isUUID(uuid, "4")) {
            return uuid;
        }
        throw new BadRequestException("Not a valid UUID");
    }
}
