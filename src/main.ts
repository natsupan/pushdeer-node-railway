import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Log4jsLogger } from '@nestx-log4js/core';
import { Logger } from '@nestjs/common';
import * as session from 'express-session';
import { TransformInterceptor } from './global/interceptor/transform.interceptor';
import { ValidationPipe } from './global/pipe/validation.pipe';
import { RequestInterceptor } from './global/interceptor/request.interceptor';

const logger = new Logger();
const PORT = 8800;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 允许跨域
  app.enableCors();
  // 配置swagger
  const config = new DocumentBuilder()
    .setTitle('PushDeerOS')
    .setDescription('PushDeer 接口文档')
    .setVersion('1.0')
    .addServer(`http://127.0.0.1:${PORT}`)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger-ui', app, document);
  // 使用log4js
  app.useLogger(app.get(Log4jsLogger));
  // // 使用session
  app.use(
    session({
      secret: 'XXiTBNXKitYZaYcWXLmZQpDMbUKpKt3tMKP6rZoVCx',
      resave: false,
      saveUninitialized: true,
    }),
  );

  // app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new RequestInterceptor(),
  );
  await app.listen(PORT);
}

bootstrap().then(() => {
  logger.log(`listen in http://localhost:${PORT}/swagger-ui`);
});
