import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter, enableApiLogging } from '@cryptodo/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Billing-api')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe({ enableDebugMessages: true }));

  app.useGlobalFilters(new AllExceptionsFilter());
  enableApiLogging(app);
  app.enableCors();

  await app.listen(3002);
}

bootstrap();
