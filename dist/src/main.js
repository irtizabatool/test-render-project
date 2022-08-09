"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const app_module_1 = require("./modules/app/app.module");
const global_constants_1 = require("./shared/constants/global.constants");
const prisma_interceptor_1 = require("./interceptors/prisma.interceptor");
const global_config_1 = require("./configs/global.config");
const logger_service_1 = require("./modules/logger/logger.service");
const invalid_form_exception_filter_1 = require("./filters/invalid.form.exception.filter");
const platform_express_1 = require("@nestjs/platform-express");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(), {
        cors: true,
        bodyParser: true
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        dismissDefaultMessages: true,
        validationError: {
            target: false,
        },
    }));
    app.setGlobalPrefix(global_constants_1.API_PREFIX);
    app.useGlobalFilters(new invalid_form_exception_filter_1.InvalidFormExceptionFilter());
    app.useGlobalInterceptors(new prisma_interceptor_1.PrismaInterceptor());
    const configService = app.get(config_1.ConfigService);
    const PORT = process.env.PORT || global_config_1.GLOBAL_CONFIG.nest.port;
    await app.listen(PORT, async () => {
        const myLogger = await app.resolve(logger_service_1.MyLogger);
        myLogger.log(`Server started listening: ${PORT}`);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map