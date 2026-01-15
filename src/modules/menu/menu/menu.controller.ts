import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dtos/create-menu.dto';
import { UpdateMenuDto } from './dtos/update-menu.dto';
import { Menu } from './schemas/menu.schema';
import { JwtAuthGuard } from 'src/modules/auth/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/guards/roles.guard';

@ApiTags('menu')
@Controller('menu')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
//   @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new menu item' })
  @ApiResponse({ status: 201, description: 'The menu item has been successfully created.', type: Menu })
  create(@Body() createMenuDto: CreateMenuDto): Promise<Menu> {
    return this.menuService.create(createMenuDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all menu items' })
  @ApiResponse({ status: 200, description: 'Return all menu items.', type: [Menu] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10): Promise<Menu[]> {
    return this.menuService.findAll(page, limit);
  }

  @Get('parent/:parentId')
  @ApiOperation({ summary: 'Get menu items by parent ID' })
  @ApiResponse({ status: 200, description: 'Return menu items for the specified parent.', type: [Menu] })
  findByParentId(@Param('parentId') parentId: number): Promise<Menu[]> {
    return this.menuService.findByParentId(parentId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a menu item by id' })
  @ApiResponse({ status: 200, description: 'Return the menu item.', type: Menu })
  @ApiResponse({ status: 404, description: 'Menu item not found.' })
  findOne(@Param('id') id: string): Promise<Menu> {
    return this.menuService.findOne(id);
  }

  @Patch(':id')
//   @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a menu item' })
  @ApiResponse({ status: 200, description: 'The menu item has been successfully updated.', type: Menu })
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto): Promise<Menu> {
    return this.menuService.update(id, updateMenuDto);
  }

  @Delete(':id')
//   @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a menu item' })
  @ApiResponse({ status: 200, description: 'The menu item has been successfully deleted.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.menuService.remove(id);
  }
}

