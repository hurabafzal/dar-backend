import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMenuDto } from './dtos/create-menu.dto';
import { UpdateMenuDto } from './dtos/update-menu.dto';
import { Menu, MenuDocument } from './schemas/menu.schema';

@Injectable()
export class MenuService {
  constructor(@InjectModel(Menu.name) private menuModel: Model<MenuDocument>) {}

  async create(createMenuDto: CreateMenuDto): Promise<Menu> {
    const createdMenu = new this.menuModel(createMenuDto);
    return createdMenu.save();
  }

  async findAll(page: number = 1, limit: number = 10): Promise<Menu[]> {
    const skip = (page - 1) * limit;
    return this.menuModel.find()
      .sort({ OrderBy: 1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async findOne(id: string): Promise<Menu> {
    const menu = await this.menuModel.findById(id).exec();
    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }
    return menu;
  }

  async update(id: string, updateMenuDto: UpdateMenuDto): Promise<Menu> {
    const updatedMenu = await this.menuModel
      .findByIdAndUpdate(id, updateMenuDto, { new: true })
      .exec();
    if (!updatedMenu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }
    return updatedMenu;
  }

  async remove(id: string): Promise<void> {
    const result = await this.menuModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }
  }

  async findByParentId(parentId: number): Promise<Menu[]> {
    return this.menuModel.find({ ParentMenuId: parentId, Show: true })
      .sort({ OrderBy: 1 })
      .exec();
  }
}

