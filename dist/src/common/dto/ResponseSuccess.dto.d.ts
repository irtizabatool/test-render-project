import { ResponseFormatter } from "../../interfaces/response.interface";
export declare class ResponseSuccess implements ResponseFormatter {
    constructor(infoMessage: string, data?: any, notLog?: boolean);
    message: string;
    data: any[];
    errorMessage: any;
    error: any;
    success: boolean;
    errCode: number;
}
