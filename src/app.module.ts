import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Env } from './common/constants';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot(Env.MONGO_URI),
    ProductModule,
    UserModule
  ]
})
export class AppModule {}
