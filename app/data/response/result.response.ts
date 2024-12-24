import { BaseErrorResponse } from "./base-error.response";

export type Result = BaseErrorResponse & {
	message?: string;
};
