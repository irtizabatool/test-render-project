import { PageDto } from "../dto/PageDto";
import { PageMetaDto } from "../dto/PageMetaDto";
import { PageOptionsDto } from "../dto/PaginationDto";

export class UtilsService {
    public static Pagination(
        data: any[],
        pageOptionsDto: PageOptionsDto,
        itemCount: number,
      ): PageDto {
        const pageMetaDto = new PageMetaDto({
          pageOptionsDto,
          itemCount,
        });
        return new PageDto(data, pageMetaDto);
      }
}