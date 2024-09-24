import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.schema';
import { ProductDto, UpdateProductDto } from 'src/dto/product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAllProducts(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get(':id')
  async getProductById(@Param('id') id: string): Promise<Product> {
    return this.productService.findById(id);
  }

  @Post()
  async createProduct(@Body() product: ProductDto): Promise<Product> {
    return this.productService.create(product);
  }

  @Put(':id')
  async updateProduct(@Param('id') id: string, @Body() product: UpdateProductDto): Promise<Product> {
    return this.productService.update(id, product);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string): Promise<void> {
    return this.productService.delete(id);
  }
}