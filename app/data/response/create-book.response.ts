import { BaseErrorResponse } from "./base-error.response";
import { Result } from "./result.response";

export type UpdateBookResponse = BaseErrorResponse & Result & {
    bookId?: number;
};
