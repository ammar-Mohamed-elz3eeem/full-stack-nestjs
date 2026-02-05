import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

async function bootstrap() {
  const cors = {
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      process.env.DOCS_URL || 'http://localhost:3000',
    ],
    credentials: true,
  };

  const app = await NestFactory.create(AppModule, {
    cors,
  });

  // Swagger/OpenAPI configuration
  const config = new DocumentBuilder()
    .setTitle('Full Stack Test API')
    .setDescription(
      'API documentation for the Full Stack Test authentication system',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('auth', 'Authentication endpoints')
    .addTag('app', 'Application endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Write OpenAPI spec to file for Mintlify docs
  const outputPath = path.resolve(__dirname, '..', 'openapi.json');
  fs.writeFileSync(outputPath, JSON.stringify(document, null, 2));
  console.log(`📝 OpenAPI spec written to ${outputPath}`);

  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT!, () => {
    console.log(`🧨 App is running on port ${process.env.PORT}`);
    console.log(
      `📚 Swagger docs available at http://localhost:${process.env.PORT}/api-docs`,
    );
  });
}

bootstrap().catch((e) => {
  console.error(e);
});
