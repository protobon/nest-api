import { IsString, MaxLength, MinLength, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class ProductDto {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    name: string;
  
    @IsString()
    @IsOptional()
    description: string;
  
    @IsString()
    price: string;
}

export class UpdateProductDto extends PartialType(ProductDto) {}