import { BaseErrorResponse } from "app/data/response/base-error.response";
import { Result } from "app/data/response/result.response";

export type LoginResponse = BaseErrorResponse &
	Result & {
		accessToken?: string | null;
		expires?: Date | null;
	};
