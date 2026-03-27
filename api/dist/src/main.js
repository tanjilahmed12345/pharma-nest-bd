"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = __importDefault(require("helmet"));
const path_1 = require("path");
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
    const nodeEnv = config.get('app.nodeEnv', 'development');
    app.use((0, helmet_1.default)({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
    }));
    app.setGlobalPrefix(apiPrefix);
    app.enableCors({
        origin: frontendUrl,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    });
    const uploadDir = config.get('upload.dir') || './uploads';
    app.useStaticAssets((0, path_1.join)(process.cwd(), uploadDir), {
        prefix: '/uploads/',
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
    }));
    app.useGlobalFilters(new http_exception_filter_1.GlobalExceptionFilter());
    app.useGlobalInterceptors(new response_interceptor_1.ResponseInterceptor());
    if (nodeEnv !== 'production') {
        const swaggerConfig = (0, swagger_config_1.buildSwaggerConfig)();
        const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
        swagger_1.SwaggerModule.setup('docs', app, document);
        logger.log(`Swagger docs: http://localhost:${port}/docs`);
    }
    await app.listen(port);
    logger.log(`Application running on: http://localhost:${port}`);
    logger.log(`API prefix: /${apiPrefix}`);
    logger.log(`Environment: ${nodeEnv}`);
}
bootstrap();
//# sourceMappingURL=main.js.map