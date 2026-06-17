"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../src/app.module");
const swagger_1 = require("@nestjs/swagger");
const fs = __importStar(require("fs"));
const Converter = require('openapi-to-postmanv2');
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { logger: ['error', 'warn', 'log', 'debug'] });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Click Marido API')
        .setDescription('API documentation for Click Marido ERP/CRM')
        .setVersion('1.0.0')
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT', name: 'JWT', in: 'header' }, 'JWT-auth')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    const openApiJson = JSON.stringify(document, null, 2);
    fs.writeFileSync('openapi.json', openApiJson);
    console.log('✅ openapi.json generated successfully!');
    Converter.convert({ type: 'json', data: document }, {
        folderStrategy: 'Tags',
        requestParametersResolution: 'Example',
        includeAuthInfoInExample: false,
    }, (err, result) => {
        if (err || !result.result) {
            console.error('❌ Failed to convert to Postman collection', err || result.reason);
            process.exit(1);
        }
        const collection = result.output[0].data;
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
//# sourceMappingURL=generate-openapi.js.map