import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from './product/product.module';
import { Env } from './common/constants';

@Module({
  imports: [
    MongooseModule.forRoot(Env.MONGO_URI),
    ProductModule
  ]
})
export class AppModule {}
