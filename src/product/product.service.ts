import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product } from './product.schema';
import { FindAllProductDto, ProductDto, UpdateProductDto } from 'src/dto/product.dto';

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private productModel: Model<Product>) {}

  async findAll(input: FindAllProductDto): Promise<Product[]> {
    const { id, name, minPrice, maxPrice, page, limit } = input;
    const pipeline: any[] = [];
    const match: any = {};
    
    if (id && id.length) {
      try {
        match._id = { $in: id.map((i) => new Types.ObjectId(i)) };
      } catch (error) {
        throw new Error('One or more invalid ObjectId formats');
      }
    }

    if (name && name.length) {
      match.name = { $in: name.map((n) => new RegExp(n, 'i')) };
    }

    if (minPrice || maxPrice) {
      match.price = {
        ...(minPrice && { $gte: minPrice }),
        ...(maxPrice && { $lte: maxPrice }),
      }
    }

    if (Object.keys(match).length) pipeline.push({ $match: match });

    pipeline.push({
      $skip: (page - 1) * limit
    });
    pipeline.push({
      $limit: limit
    });

    return this.productModel.aggregate(pipeline).exec();
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