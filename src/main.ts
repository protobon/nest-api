import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Env } from './common/constants';
import { LoggerInterceptor } from './interceptors/logger.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new LoggerInterceptor());
  app.setGlobalPrefix('api');
  await app.listen(Env.PORT, () => {
    console.log(`Server running on http://${Env.HOST}:${Env.PORT}`);
  });
}
bootstrap();
