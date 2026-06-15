import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
const Converter = require('openapi-to-postmanv2');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'log', 'debug'] });

  const config = new DocumentBuilder()
    .setTitle('Click Marido API')
    .setDescription('API documentation for Click Marido ERP/CRM')
    .setVersion('1.0.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT', name: 'JWT', in: 'header' }, 'JWT-auth')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Write openapi.json
  const openApiJson = JSON.stringify(document, null, 2);
  fs.writeFileSync('openapi.json', openApiJson);
  console.log('✅ openapi.json generated successfully!');

  // Convert to Postman
  Converter.convert({ type: 'json', data: document }, {
    folderStrategy: 'Tags',
    requestParametersResolution: 'Example',
    includeAuthInfoInExample: false,
  }, (err: any, result: any) => {
    if (err || !result.result) {
      console.error('❌ Failed to convert to Postman collection', err || result.reason);
      process.exit(1);
    }
    
    const collection = result.output[0].data;

    // Add generic test to the collection
    const event = [{
      listen: 'test',
      script: {
        exec: [
          "pm.test(\"Status code is 200 or 201\", function () {",
          "    pm.expect(pm.response.code).to.be.oneOf([200, 201]);",
          "});"
        ],
        type: 'text/javascript'
      }
    }];
    collection.event = event;

    fs.writeFileSync('clickmarido.postman_collection.json', JSON.stringify(collection, null, 2));
    console.log('✅ clickmarido.postman_collection.json generated successfully!');
  });

  await app.close();
}

bootstrap().catch(err => {
  console.error("FAILED TO RUN:", err);
  process.exit(1);
});
