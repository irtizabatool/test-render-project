"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseSuccess = void 0;
class ResponseSuccess {
    constructor(infoMessage, data, notLog) {
        this.success = true;
        this.message = infoMessage;
        this.data = data;
        if (!notLog) {
            try {
                const offuscateRequest = JSON.parse(JSON.stringify(data));
                if (offuscateRequest && offuscateRequest.token) {
                    offuscateRequest.token = "*******";
                }
            }
            catch (error) { }
        }
    }
}
exports.ResponseSuccess = ResponseSuccess;
//# sourceMappingURL=ResponseSuccess.dto.js.map