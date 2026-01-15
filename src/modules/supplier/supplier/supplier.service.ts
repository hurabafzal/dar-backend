import { Injectable, BadRequestException, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../user/schemas/user.schema';
import { validateEmail } from 'src/shared/helper/helper';

@Injectable()
export class SupplierService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  private async checkUniquePhone(phone: string, excludeId?: string): Promise<void> {
    const query: any = { phone };
    if (excludeId) {
      query['_id'] = { $ne: excludeId };
    }
    const existingUser = await this.userModel.findOne(query).exec();
    if (existingUser) {
      throw new ConflictException('Supplier with this phone number already exists');
    }
  }

  private async checkUniqueEmail(email: string, excludeId?: string): Promise<void> {
    if (email === '') return;
    const query: any = { email };
    if (excludeId) {
      query['_id'] = { $ne: excludeId };
    }
    const existingUser = await this.userModel.findOne(query).exec();
    if (existingUser) {
      throw new ConflictException('Supplier with this email already exists');
    }
  }

  async create(createSupplierDto: Partial<User>): Promise<User> {
    try {
      if (!createSupplierDto.phone) {
        throw new BadRequestException('Phone number is required');
      }

      await this.checkUniquePhone(createSupplierDto.phone);

      if (createSupplierDto.email !== undefined) {
        if (!validateEmail(createSupplierDto.email)) {
          throw new BadRequestException('Invalid email format');
        }
        await this.checkUniqueEmail(createSupplierDto.email);
      }

      const createdSupplier = new this.userModel({
        ...createSupplierDto,
        groupId: 4,
      });

      const savedUser = await createdSupplier.save();

      if (!savedUser) {
        throw new InternalServerErrorException('Failed to create supplier');
      }

      return savedUser;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof ConflictException || error instanceof InternalServerErrorException) {
        throw error;
      }
      console.error('Error creating supplier:', error);
      throw new InternalServerErrorException('An unexpected error occurred while creating the supplier');
    }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find({ groupId: 4 }).exec();
  }

  async findOne(id: string): Promise<User> {
    const supplier = await this.userModel.findOne({ _id: id, groupId: 4 }).exec();
    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }
    return supplier;
  }

  async update(id: string, updateSupplierDto: Partial<User>): Promise<User> {
    try {
      const existingSupplier = await this.findOne(id);

      if (updateSupplierDto.phone && updateSupplierDto.phone !== existingSupplier.phone) {
        await this.checkUniquePhone(updateSupplierDto.phone, id);
      }

      if (updateSupplierDto.email !== undefined && updateSupplierDto.email !== existingSupplier.email && updateSupplierDto.email != "") {
        if (!validateEmail(updateSupplierDto.email)) {
          throw new BadRequestException('Invalid email format');
        }
        await this.checkUniqueEmail(updateSupplierDto.email, id);
      }

      const updatedSupplier = await this.userModel
        .findOneAndUpdate(
          { _id: id, groupId: 4 },
          { ...updateSupplierDto, email: updateSupplierDto.email === '' ? null : updateSupplierDto.email },
          { new: true }
        )
        .exec();

      if (!updatedSupplier) {
        throw new NotFoundException(`Supplier with ID ${id} not found`);
      }
      return updatedSupplier;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof ConflictException || error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error updating supplier:', error);
      throw new InternalServerErrorException('An unexpected error occurred while updating the supplier');
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.deleteOne({ _id: id, groupId: 4 }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }
  }
}

