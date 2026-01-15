import { Injectable, BadRequestException, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../user/schemas/user.schema';
import { validateEmail } from 'src/shared/helper/helper';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) { }

  private async checkUniquePhone(phone: string, excludeId?: string): Promise<void> {
    const query = { phone };
    if (excludeId) {
      query['_id'] = { $ne: excludeId };
    }
    const existingUser = await this.userModel.findOne(query).exec();
    if (existingUser) {
      throw new ConflictException('User with this phone number already exists');
    }
  }

  async findMultiple(ids: string[]): Promise<User[]> {
    return this.userModel.find({ 
      _id: { $in: ids }, 
      groupId: 3 
    }).exec();
  }

  async create(createCustomerDto: Partial<User>): Promise<User> {
    try {
      if (!createCustomerDto.phone) {
        throw new BadRequestException('Phone number is required');
      }

      await this.checkUniquePhone(createCustomerDto.phone);

      if (createCustomerDto.email && createCustomerDto.email != "") {
        if (!validateEmail(createCustomerDto.email)) {
          throw new BadRequestException('Invalid email format');
        }
        const existingUser = await this.userModel.findOne({ email: createCustomerDto.email }).exec();
        if (existingUser) {
          throw new ConflictException('User with this email already exists');
        }
      }

      const createdCustomer = new this.userModel({
        ...createCustomerDto,
        groupId: 3,
      });

      const savedUser = await createdCustomer.save();

      if (!savedUser) {
        throw new InternalServerErrorException('Failed to create user');
      }

      return savedUser;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof ConflictException || error instanceof InternalServerErrorException) {
        throw error;
      }
      console.error('Error creating user:', error);
      throw new InternalServerErrorException('An unexpected error occurred while creating the user');
    }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find({ groupId: 3 }).exec();
  }

  async findOne(id: string): Promise<User> {
    const customer = await this.userModel.findOne({ _id: id, groupId: 3 }).exec();
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  async update(id: string, updateCustomerDto: Partial<User>): Promise<User> {
    try {
      if (updateCustomerDto.phone) {
        await this.checkUniquePhone(updateCustomerDto.phone, id);
      }

      if (updateCustomerDto.email) {
        if (!validateEmail(updateCustomerDto.email)) {
          throw new BadRequestException('Invalid email format');
        }
        const existingUser = await this.userModel.findOne({
          email: updateCustomerDto.email,
          _id: { $ne: id }
        }).exec();
        if (existingUser) {
          throw new ConflictException('User with this email already exists');
        }
      }

      const updatedCustomer = await this.userModel
        .findOneAndUpdate({ _id: id, groupId: 3 }, updateCustomerDto, { new: true })
        .exec();
      if (!updatedCustomer) {
        throw new NotFoundException(`Customer with ID ${id} not found`);
      }
      return updatedCustomer;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof ConflictException || error instanceof NotFoundException) {
        throw error;
      }

      console.error('Error updating user:', error);
      throw new InternalServerErrorException('An unexpected error occurred while updating the user');
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.deleteOne({ _id: id, groupId: 3 }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
  }
}

