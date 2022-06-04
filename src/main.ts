import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('VSL')
    .setDescription('The VSL API description')
    .setVersion('1.0')
    .addTag('VSL')
    .addSecurity('basic', { type: 'http', scheme: 'basic' })
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('', app, document);
  
  await app.listen(3000);
}
bootstrap();
