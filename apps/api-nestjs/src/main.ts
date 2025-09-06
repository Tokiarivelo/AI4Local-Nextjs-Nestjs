import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Activer CORS pour permettre les requêtes depuis le frontend
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
  });
  
  // Activer la validation globale
  app.useGlobalPipes(new ValidationPipe());
  
  await app.listen(process.env.PORT ?? 4000);
  console.log('🚀 NestJS API démarrée sur http://localhost:4000');
  console.log('📊 GraphQL Playground disponible sur http://localhost:4000/graphql');
}
bootstrap();
