import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DiscountCodeService } from './discount-code.service';
import { DiscountCode } from './schemas/discount-code.schema';
import { CreateDiscountCodeDto } from './dtos/create-discount-code.dto';
import { UpdateDiscountCodeDto } from './dtos/update-discount-code.dto';

@ApiTags('discount-code')
@Controller('discount-code')
export class DiscountCodeController {
  constructor(private readonly discountCodeService: DiscountCodeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new DiscountCode' })
  @ApiResponse({
    status: 201,
    description: 'The DiscountCode has been successfully created.',
    type: DiscountCode,
  })
  create(
    @Body() createDiscountCodeDto: CreateDiscountCodeDto,
  ): Promise<DiscountCode> {
    return this.discountCodeService.create(createDiscountCodeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Discount Codes' })
  @ApiResponse({
    status: 200,
    description: 'Return all Discount Codes.',
    type: [DiscountCode],
  })
  findAll(): Promise<DiscountCode[]> {
    return this.discountCodeService.findAll();
  }

  @Get('valid-codes')
  @ApiOperation({ summary: 'Get all Discount Codes' })
  @ApiResponse({
    status: 200,
    description: 'Return all Discount Codes.',
    type: [DiscountCode],
  })
  getValidDiscountCodes(): Promise<DiscountCode[]> {
    return this.discountCodeService.getValidDiscountCodes();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an Discount Code by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the Discount Code.',
    type: DiscountCode,
  })
  @ApiResponse({ status: 404, description: 'Discount Code not found.' })
  findOne(@Param('id') id: string): Promise<DiscountCode> {
    return this.discountCodeService.findOne(id);
  }

  @Get('by-name/:name')
  @ApiOperation({ summary: 'Get a Discount Code by name' })
  @ApiResponse({
    status: 200,
    description: 'Return the Discount Code.',
    type: DiscountCode,
  })
  @ApiResponse({ status: 404, description: 'Discount Code not found.' })
  findByName(@Param('name') name: string): Promise<DiscountCode> {
    return this.discountCodeService.findByName(name);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an Discount Code' })
  @ApiResponse({
    status: 200,
    description: 'The Discount Code has been successfully updated.',
    type: DiscountCode,
  })
  
  update(
    @Param('id') id: string,
    @Body() updateDiscountCodeDto: UpdateDiscountCodeDto,
  ): Promise<DiscountCode> {
    return this.discountCodeService.update(id, updateDiscountCodeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an DiscountCode' })
  @ApiResponse({
    status: 200,
    description: 'The Discount Code has been successfully deleted.',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.discountCodeService.remove(id);
  }
}
