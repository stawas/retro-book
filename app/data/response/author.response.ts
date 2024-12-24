import { BaseErrorResponse } from "./base-error.response";

export type AuthorResponse = {
    ID: number | null;
    CreatedAt: string | null;
    UpdatedAt: string | null;
    name: string | null;
};

export type AuthorListResponse = BaseErrorResponse & {
    authors?: AuthorResponse[];
};