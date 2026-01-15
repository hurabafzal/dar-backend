import {
  Controller,
  Get,
  Post,
  Put,
  Delete, // ✅ Delete Import hinzufügen
  Body,
  Param
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam
} from '@nestjs/swagger';
import { DesignService } from './design.service';

@ApiTags('designs')
@Controller('design')
export class DesignController {
  constructor(private readonly designService: DesignService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user design' })
  @ApiResponse({
    status: 201,
    description: 'Design successfully created',
  })
  async create(@Body() body: { userId: string; orderData: any }) {
    return this.designService.create(body.userId, body.orderData);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update existing design' })
  @ApiParam({ name: 'id', description: 'Design ID' })
  @ApiResponse({
    status: 200,
    description: 'Design successfully updated',
  })
  async update(
    @Param('id') id: string,
    @Body() body: { orderData: any }
  ) {
    return this.designService.update(id, body.orderData);
  }

  @Get('latest/:userId')
  @ApiOperation({ summary: 'Get latest design for user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Latest design found',
  })
  @ApiResponse({
    status: 404,
    description: 'No design found for user',
  })
  async getLatest(@Param('userId') userId: string) {
    return this.designService.getLatestByUser(userId);
  }

  @Delete('user/:userId')
  @ApiOperation({ summary: 'Delete all designs for a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Designs successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'No designs found for user',
  })
  async deleteByUserId(@Param('userId') userId: string) {
    return this.designService.deleteByUserId(userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete design by ID' })
  @ApiParam({ name: 'id', description: 'Design ID' })
  @ApiResponse({
    status: 200,
    description: 'Design successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Design not found',
  })
  async deleteById(@Param('id') id: string) {
    return this.designService.deleteById(id);
  }
}