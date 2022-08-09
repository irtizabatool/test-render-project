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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const UserRegister_dto_1 = require("./dto/UserRegister.dto");
const UserLogin_dto_1 = require("./dto/UserLogin.dto");
const ForgotPassword_dto_1 = require("./dto/ForgotPassword.dto");
const ResetPassword_dto_1 = require("./dto/ResetPassword.dto");
const ResponseSuccess_dto_1 = require("../../common/dto/ResponseSuccess.dto");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(user) {
        const userData = await this.authService.login(user);
        return new ResponseSuccess_dto_1.ResponseSuccess(`User info with access token`, userData);
    }
    async register(user) {
        const createdUser = await this.authService.register(user);
        return new ResponseSuccess_dto_1.ResponseSuccess(`Successfully Registered.`, createdUser);
    }
    async forgotPassword(forgotPasswordDto) {
        const linkSent = await this.authService.forgotPassword(forgotPasswordDto);
        return new ResponseSuccess_dto_1.ResponseSuccess(`Forgot Password Link Sent Successfully`, linkSent);
    }
    async resetPassword(resetPasswordDto) {
        const passwordChanged = await this.authService.resetPassword(resetPasswordDto);
        return new ResponseSuccess_dto_1.ResponseSuccess(`Changed Password Successfully`, passwordChanged);
    }
};
__decorate([
    (0, common_1.Post)("login"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserLogin_dto_1.UserLoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)("register"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserRegister_dto_1.UserRegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)("forgot-password"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ForgotPassword_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)("reset-password"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ResetPassword_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
AuthController = __decorate([
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map