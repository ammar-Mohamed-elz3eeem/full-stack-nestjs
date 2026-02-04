import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function generateOpenApiSpec() {
  const app = await NestFactory.create(AppModule, { logger: false });

  const config = new DocumentBuilder()
    .setTitle('Full Stack Test API')
    .setDescription(
      'API documentation for the Full Stack Test authentication system',
    )
    .setVersion('1.0')
    .addServer('http://localhost:3000', 'Local Development Server')
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

  const outputPath = path.resolve(__dirname, '..', 'openapi.json');
  fs.writeFileSync(outputPath, JSON.stringify(document, null, 2));
  console.log(`✅ OpenAPI spec generated at ${outputPath}`);

  await app.close();
  process.exit(0);
}

generateOpenApiSpec().catch((e) => {
  console.error('Error generating OpenAPI spec:', e);
  process.exit(1);
});
