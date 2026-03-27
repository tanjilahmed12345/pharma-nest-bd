"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const response_interceptor_1 = require("./common/interceptors/response.interceptor");
const swagger_config_1 = require("./config/swagger.config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = app.get(config_1.ConfigService);
    const logger = new common_1.Logger('Bootstrap');
    const port = config.get('app.port', 3001);
    const apiPrefix = config.get('app.apiPrefix', 'api/v1');
    const frontendUrl = config.get('app.frontendUrl', 'http://localhost:3000');
    app.setGlobalPrefix(apiPrefix);
    app.enableCors({
        origin: frontendUrl,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
    }));
    app.useGlobalFilters(new http_exception_filter_1.GlobalExceptionFilter());
    app.useGlobalInterceptors(new response_interceptor_1.ResponseInterceptor());
    const swaggerConfig = (0, swagger_config_1.buildSwaggerConfig)();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('docs', app, document);
    await app.listen(port);
    logger.log(`Application running on: http://localhost:${port}`);
    logger.log(`API prefix: /${apiPrefix}`);
    logger.log(`Swagger docs: http://localhost:${port}/docs`);
    logger.log(`Environment: ${config.get('app.nodeEnv')}`);
}
bootstrap();
//# sourceMappingURL=main.js.map