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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const user_service_1 = require("./user.service");
const auth_guard_1 = require("../../guards/auth.guard");
const roles_guard_1 = require("../../guards/roles.guard");
const roles_decorator_1 = require("../../decorators/roles.decorator");
const UserRegister_dto_1 = require("../auth/dto/UserRegister.dto");
const auth_user_decorator_1 = require("../../decorators/auth.user.decorator");
const ResponseSuccess_dto_1 = require("../../common/dto/ResponseSuccess.dto");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async getAll() {
        return this.userService.users();
    }
    async signupUser(userData) {
        return this.userService.createUser(userData);
    }
    async logout(user) {
        const status = await this.userService.logout(user);
        return new ResponseSuccess_dto_1.ResponseSuccess(`Successfully Logged Out`, status);
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.RoleType.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAll", null);
__decorate([
    (0, common_1.Post)("create"),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.RoleType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserRegister_dto_1.UserRegisterDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "signupUser", null);
__decorate([
    (0, common_1.Post)("logout"),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.RoleType.ADMIN, client_1.RoleType.USER),
    __param(0, (0, auth_user_decorator_1.AuthUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "logout", null);
UserController = __decorate([
    (0, common_1.Controller)("user"),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map