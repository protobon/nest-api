import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './product.schema';
import { ProductDto, UpdateProductDto } from 'src/dto/product.dto';

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private productModel: Model<Product>) {}

  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async findById(id: string): Promise<Product> {
    return this.productModel.findById(id).exec();
  }

  async create(product: ProductDto): Promise<Product> {
    const newProduct = new this.productModel(product);
    return newProduct.save();
  }

  async update(id: string, product: UpdateProductDto): Promise<Product> {
    return this.productModel.findByIdAndUpdate(id, product, { new: true }).exec();
  }

  async delete(id: string): Promise<void> {
    await this.productModel.deleteOne({id}).exec();
  }
}