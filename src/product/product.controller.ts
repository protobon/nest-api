import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.schema';
import { FindAllProductDto, ProductDto, UpdateProductDto } from 'src/dto/product.dto';
import { ValidateObjectIdPipe } from 'src/common/validation';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAllProducts(@Query() input: FindAllProductDto): Promise<Product[]> {
    return this.productService.findAll(input);
  }

  @Get(':id')
  async getProductById(@Param('id', ValidateObjectIdPipe) id: string): Promise<Product> {
    return this.productService.findById(id);
  }

  @Post()
  async createProduct(@Body() product: ProductDto): Promise<Product> {
    return this.productService.create(product);
  }

  @Put(':id')
  async updateProduct(@Param('id', ValidateObjectIdPipe) id: string, @Body() product: UpdateProductDto): Promise<Product> {
    return this.productService.update(id, product);
  }

  @Delete(':id')
  async deleteProduct(@Param('id', ValidateObjectIdPipe) id: string): Promise<void> {
    return this.productService.delete(id);
  }
}