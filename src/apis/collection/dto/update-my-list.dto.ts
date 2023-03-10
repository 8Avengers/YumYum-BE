import { CreateMyListDto } from './create-my-list.dto';
import { PartialType } from '@nestjs/mapped-types';
//create-my-list.dto.ts extendts

export class UpdateMyListDto extends PartialType(CreateMyListDto) {}