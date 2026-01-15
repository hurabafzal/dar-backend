import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsDateString } from 'class-validator';
import { EOrderStatus } from 'src/shared/enums/order-status.enum';

export class GetOrdersQueryDto {
  @ApiPropertyOptional({
    description: 'Filter orders by status',
    enum: EOrderStatus,
  })
  @IsOptional()
  @IsEnum(EOrderStatus)
  status?: EOrderStatus;

  @ApiPropertyOptional({
    description: 'Start date to filter orders',
    example: '2024-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'End date to filter orders',
    example: '2024-12-31T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
