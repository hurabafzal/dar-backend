import { PartialType } from '@nestjs/swagger';
import { CreateBlockDateDto } from './create-block-date.dto';

export class UpdateBlockDateDto extends PartialType(CreateBlockDateDto) {}

