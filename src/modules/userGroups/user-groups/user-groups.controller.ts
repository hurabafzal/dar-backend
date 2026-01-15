import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UserGroupsService } from './user-groups.service';
import { CreateUserGroupsDto } from './dtos/create-user-groups.dto';
import { UpdateUserGroupsDto } from './dtos/update-user-groups.dto';
import { UserGroups } from './schemas/user-groups.schema';
import { JwtAuthGuard } from 'src/modules/auth/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/guards/roles.guard';

@ApiTags('user-groups')
@Controller('user-groups')
// @UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UserGroupsController {
  constructor(private readonly userGroupsService: UserGroupsService) { }

  @Post()
  //   @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user group' })
  @ApiResponse({ status: 201, description: 'The user group has been successfully created.', type: UserGroups })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createUserGroupDto: CreateUserGroupsDto): Promise<UserGroups> {
    return this.userGroupsService.create(createUserGroupDto);
  }

  @Get()
  //   @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all user groups' })
  @ApiResponse({ status: 200, description: 'Return all user groups.', type: [UserGroups] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10): Promise<UserGroups[]> {
    return this.userGroupsService.findAll(page, limit);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a user group by id' })
  @ApiResponse({ status: 200, description: 'Return the user group.', type: UserGroups })
  @ApiResponse({ status: 404, description: 'User group not found.' })
  async findOne(@Param('id') id: string): Promise<UserGroups> {
    return this.userGroupsService.findOne(+id);
  }

  @Patch(':id')
  //   @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a user group' })
  @ApiResponse({ status: 200, description: 'The user group has been successfully updated.', type: UserGroups })
  @ApiResponse({ status: 404, description: 'User group not found.' })
  async update(@Param('id') id: string, @Body() updateUserGroupDto: UpdateUserGroupsDto): Promise<UserGroups> {
    return this.userGroupsService.update(id, updateUserGroupDto);
  }

  @Delete(':id')
  //   @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user group' })
  @ApiResponse({ status: 204, description: 'The user group has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'User group not found.' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.userGroupsService.remove(id);
  }
}

