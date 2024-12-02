import { IsString, MaxLength, MinLength, IsOptional, IsArray } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { PaginationDto } from './pagination.dto';

export class ProductDto {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    name: string;
  
    @IsString()
    @IsOptional()
    description?: string;
  
    @IsString()
    price: string;
}

export class UpdateProductDto extends PartialType(ProductDto) {}

export class FindAllProductDto extends PaginationDto {
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    id?: string[];

    @IsArray()
    @IsString({ each: true })
    @MinLength(4, { each: true })
    @MaxLength(20, { each: true })
    @IsOptional()
    name?: string[];

    @IsString()
    @IsOptional()
    minPrice?: string;

    @IsString()
    @IsOptional()
    maxPrice?: string;
}