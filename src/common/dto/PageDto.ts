import { PageMetaDto } from './PageMetaDto';

export class PageDto {
  readonly data: any[];
  readonly meta: PageMetaDto;

  constructor(data: any[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
