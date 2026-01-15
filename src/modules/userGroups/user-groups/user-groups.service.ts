import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserGroups, UserGroupsDocument } from './schemas/user-groups.schema';
import { CreateUserGroupsDto } from './dtos/create-user-groups.dto';
import { UpdateUserGroupsDto } from './dtos/update-user-groups.dto';

@Injectable()
export class UserGroupsService {
  constructor(
    @InjectModel(UserGroups.name)
    private userGroupsModel: Model<UserGroupsDocument>,
  ) {}

  async create(createUserGroupDto: CreateUserGroupsDto): Promise<UserGroups> {
    try {
      const createdUserGroup = new this.userGroupsModel(createUserGroupDto);
      return await createdUserGroup.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          'User group with this groupCd already exists',
        );
      }
      throw new InternalServerErrorException('Failed to create user group');
    }
  }

  async findAll(page: number = 1, limit: number = 10): Promise<UserGroups[]> {
    try {
      const skip = (page - 1) * limit;
      return await this.userGroupsModel.find().skip(skip).limit(limit).exec();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve user groups');
    }
  }

  async findOne(groupId: number): Promise<UserGroups> {
    try {
      const userGroup = await this.userGroupsModel.findOne({ groupId }).exec();
      if (!userGroup) {
        throw new NotFoundException(
          `User group with ID "${groupId}" not found`,
        );
      }
      return userGroup;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve user group');
    }
  }

  async update(
    id: string,
    updateUserGroupDto: UpdateUserGroupsDto,
  ): Promise<UserGroups> {
    try {
      const updatedUserGroup = await this.userGroupsModel
        .findByIdAndUpdate(id, updateUserGroupDto, { new: true })
        .exec();
      if (!updatedUserGroup) {
        throw new NotFoundException(`User group with ID "${id}" not found`);
      }
      return updatedUserGroup;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update user group');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.userGroupsModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new NotFoundException(`User group with ID "${id}" not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete user group');
    }
  }
}
