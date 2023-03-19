"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const http_exception_filter_1 = require("./common/exceptions/http-exception.filter");
const swagger_1 = require("@nestjs/swagger");
const dist_1 = require("@nestjs/swagger/dist");
async function bootstrap() {
    const port = process.env.PORT;
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = new swagger_1.DocumentBuilder()
        .setTitle('YumYum API')
        .setDescription('어서오세요. YUMYUMDB API 문서입니다')
        .setVersion('0.0.1')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'Token',
    }, 'access-Token')
        .build();
    const document = dist_1.SwaggerModule.createDocument(app, config);
    dist_1.SwaggerModule.setup('api', app, document);
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidUnknownValues: true,
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.enableCors({
        origin: true,
        credentials: true,
    });
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map