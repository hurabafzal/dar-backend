import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SmsService } from './sms.service';
import { CreateSmsDto } from './dtos/create-sms.dto';
import { UpdateSmsDto } from './dtos/update-sms.dto';
import { Sms } from './schemas/sms.schema';
import { JwtAuthGuard } from 'src/modules/auth/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { Roles } from 'src/core/decorators/roles.decorator';
import { UserRole } from 'src/modules/user/enums/user-role.enum';

@ApiTags('sms')
@Controller('sms')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post()
  @Roles(UserRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Create a new SMS' })
  @ApiResponse({ status: 201, description: 'The SMS has been successfully created.', type: Sms })
  create(@Body() createSmsDto: CreateSmsDto): Promise<Sms> {
    return this.smsService.create(createSmsDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all SMS' })
  @ApiResponse({ status: 200, description: 'Return all SMS.', type: [Sms] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10): Promise<Sms[]> {
    return this.smsService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an SMS by id' })
  @ApiResponse({ status: 200, description: 'Return the SMS.', type: Sms })
  @ApiResponse({ status: 404, description: 'SMS not found.' })
  findOne(@Param('id') id: string): Promise<Sms> {
    return this.smsService.findOne(id);
  }

  @Patch(':id')
  // @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update an SMS' })
  @ApiResponse({ status: 200, description: 'The SMS has been successfully updated.', type: Sms })
  update(@Param('id') id: string, @Body() updateSmsDto: UpdateSmsDto): Promise<Sms> {
    return this.smsService.update(id, updateSmsDto);
  }

  @Delete(':id')
  // @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete an SMS' })
  @ApiResponse({ status: 200, description: 'The SMS has been successfully deleted.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.smsService.remove(id);
  }
}
