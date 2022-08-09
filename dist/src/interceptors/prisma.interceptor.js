"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const runtime_1 = require("@prisma/client/runtime");
const prisma_constants_1 = require("../shared/constants/prisma.constants");
const invalid_form_exception_1 = require("../exceptions/invalid.form.exception");
let PrismaInterceptor = class PrismaInterceptor {
    intercept(context, next) {
        return next.handle().pipe((0, operators_1.catchError)((error) => {
            if (error instanceof runtime_1.PrismaClientKnownRequestError) {
                const constraint = error.meta && error.meta['target'].join(', ');
                const customMessage = prisma_constants_1.PRISMA_ERRORS[error.code].replace('{constraint}', constraint);
                const errors = {
                    [constraint]: customMessage,
                };
                const prismaErrorSplitStr = `invocation:\n\n\n  `;
                const errorMessage = error.message.split(prismaErrorSplitStr)[1] || error.message;
                throw new invalid_form_exception_1.InvalidFormException(errors, errorMessage);
            }
            else {
                throw error;
            }
        }));
    }
};
PrismaInterceptor = __decorate([
    (0, common_1.Injectable)()
], PrismaInterceptor);
exports.PrismaInterceptor = PrismaInterceptor;
//# sourceMappingURL=prisma.interceptor.js.map