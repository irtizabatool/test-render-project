"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("../user/user.service");
const prisma_service_1 = require("../prisma/prisma.service");
const auth_helpers_1 = require("../../shared/helpers/auth.helpers");
const global_config_1 = require("../../configs/global.config");
const bcrypt_1 = require("bcrypt");
const email_service_1 = require("../email/email.service");
let AuthService = class AuthService {
    constructor(userService, prisma, jwtService, emailService) {
        this.userService = userService;
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }
    async login(userLoginDto) {
        const userData = await this.userService.findUser(userLoginDto.email);
        if (!userData) {
            throw new common_1.UnauthorizedException('Incorrect Email or Password');
        }
        const isMatch = await auth_helpers_1.AuthHelpers.validateHash(userLoginDto.password, userData && userData.password);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Incorrect Email or Password');
        }
        const payload = {
            id: userData.id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            companyName: userData.companyName,
            email: userData.email,
            password: null,
            role: userData.role,
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt
        };
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: global_config_1.GLOBAL_CONFIG.security.expiresIn,
        });
        return {
            user: payload,
            accessToken: accessToken,
        };
    }
    async register(user) {
        const userCreated = await this.userService.createUser(user);
        const payload = {
            id: userCreated.id,
            firstName: userCreated.firstName,
            lastName: userCreated.lastName,
            companyName: userCreated.companyName,
            email: userCreated.email,
            password: null,
            role: userCreated.role,
            createdAt: userCreated.createdAt,
            updatedAt: userCreated.updatedAt
        };
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: global_config_1.GLOBAL_CONFIG.security.expiresIn,
        });
        return {
            user: payload,
            accessToken: accessToken,
        };
    }
    async forgotPassword(forgotPasswordDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: forgotPasswordDto.email }
        });
        if (!user) {
            throw new common_1.BadRequestException('User with this email was not found');
        }
        const token = this.jwtService.sign({
            email: forgotPasswordDto.email,
        });
        const forgotPasswordRoute = 'forgot-password/confirm';
        const confirmPassChangeURL = `${process.env.FRONTEND_URL}/${forgotPasswordRoute}/${token}`;
        common_1.Logger.log(confirmPassChangeURL);
        this.emailService.sendEmail(user.email, [], [], 'Reset Password Link', './reset-password', {
            link: confirmPassChangeURL
        });
        return true;
    }
    async resetPassword(resetPasswordDto) {
        const decoded = this.jwtService.decode(resetPasswordDto.token);
        const email = decoded.email;
        const user = await this.prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            throw new common_1.BadRequestException('User with this email was not found');
        }
        const salt = await (0, bcrypt_1.genSalt)(10);
        const hashedPassword = await (0, bcrypt_1.hash)(resetPasswordDto.password, salt);
        user.password = hashedPassword;
        await this.prisma.user.update({
            where: { id: user.id },
            data: Object.assign({}, user)
        });
        return true;
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        prisma_service_1.PrismaService,
        jwt_1.JwtService,
        email_service_1.EmailService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map