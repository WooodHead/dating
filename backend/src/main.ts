import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {useContainer} from "class-validator";
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 8080;

  const config = new DocumentBuilder()
    .setTitle('Dating')
    .setVersion('1.0')
      .addBearerAuth({
        type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header'
      }, 'JWT')
    .build();

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.setGlobalPrefix('api');
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    stopAtFirstError: false
  }));
  await app.listen(port, () => console.log(`server started on port ${port}`));
}
bootstrap();
