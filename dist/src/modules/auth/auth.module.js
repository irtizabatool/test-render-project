"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("../user/user.service");
const global_constants_1 = require("../../shared/constants/global.constants");
const prisma_module_1 = require("../prisma/prisma.module");
const prisma_service_1 = require("../prisma/prisma.service");
const auth_jwt_strategy_1 = require("./auth.jwt.strategy");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const email_module_1 = require("../email/email.module");
const email_service_1 = require("../email/email.service");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: global_constants_1.JWT_SECRET,
            }),
            prisma_module_1.PrismaModule,
            email_module_1.EmailModule
        ],
        providers: [user_service_1.UserService, auth_service_1.AuthService, auth_jwt_strategy_1.JwtStrategy, prisma_service_1.PrismaService, email_service_1.EmailService],
        controllers: [auth_controller_1.AuthController],
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map