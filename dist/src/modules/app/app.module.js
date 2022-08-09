"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const user_module_1 = require("../user/user.module");
const auth_module_1 = require("../auth/auth.module");
const prisma_module_1 = require("../prisma/prisma.module");
const global_config_1 = require("../../configs/global.config");
const logger_module_1 = require("../logger/logger.module");
const app_service_1 = require("./app.service");
const app_controller_1 = require("./app.controller");
const mailer_1 = require("@nestjs-modules/mailer");
const handlebars_adapter_1 = require("@nestjs-modules/mailer/dist/adapters/handlebars.adapter");
const path_1 = __importDefault(require("path"));
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            logger_module_1.LoggerModule,
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            config_1.ConfigModule.forRoot({ isGlobal: true, load: [() => global_config_1.GLOBAL_CONFIG] }),
            mailer_1.MailerModule.forRoot({
                transport: {
                    host: process.env.SENDGRID_SERVER,
                    port: process.env.SENDGRID_PORT,
                    secure: false,
                    auth: {
                        user: process.env.SENDGRID_USERNAME,
                        pass: process.env.SENDGRID_KEY,
                    },
                },
                defaults: {
                    from: '"nest-modules" <modules@nestjs.com>',
                },
                template: {
                    dir: path_1.default.join(__dirname, '../../../', '/mail-templates'),
                    adapter: new handlebars_adapter_1.HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
        exports: [],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map