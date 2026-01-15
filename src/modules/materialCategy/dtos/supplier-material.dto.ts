import { IsNotEmpty, IsString } from 'class-validator';

export class SupplierMaterialDto {
  @IsNotEmpty()
  @IsString()
  id: string; // Category ID

  @IsNotEmpty()
  @IsString()
  materialId: string; // Supplier Material ID
}
