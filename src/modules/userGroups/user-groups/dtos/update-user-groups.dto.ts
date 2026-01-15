import { PartialType } from '@nestjs/swagger';
import { CreateUserGroupsDto } from './create-user-groups.dto';

export class UpdateUserGroupsDto extends PartialType(CreateUserGroupsDto) {}

