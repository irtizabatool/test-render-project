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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt_1 = require("bcrypt");
const prisma_service_1 = require("../prisma/prisma.service");
let UserService = class UserService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findUser(email) {
        try {
            const userFound = await this.prisma.user.findUnique({
                where: { email },
            });
            return userFound;
        }
        catch (e) {
            throw new common_1.UnauthorizedException('User with this Email or Password was not found');
        }
    }
    async users() {
        const users = await this.prisma.user.findMany();
        users.forEach((users) => {
            users.password = null;
        });
        return users;
    }
    async createUser(userRegisterDto) {
        const { email, password } = userRegisterDto;
        const salt = await (0, bcrypt_1.genSalt)(10);
        userRegisterDto.password = await (0, bcrypt_1.hash)(userRegisterDto.password, salt);
        const userFound = await this.prisma.user.findFirst({
            where: { email },
        });
        if (userFound) {
            throw new common_1.HttpException("User Already Exists", common_1.HttpStatus.BAD_REQUEST);
        }
        const user = await this.prisma.user.create({
            data: userRegisterDto,
        });
        return user;
    }
    async updateUser(params) {
        const { where, data } = params;
        return this.prisma.user.update({
            data,
            where,
        });
    }
    async deleteUser(where) {
        return this.prisma.user.delete({
            where,
        });
    }
    async logout(user) {
        common_1.Logger.log(`${user.email} logging out`);
        return true;
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map