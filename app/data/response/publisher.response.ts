import { BaseErrorResponse } from "./base-error.response";

export type PublisherResponse = {
    ID: number | null;
    CreatedAt: string | null;
    UpdatedAt: string | null;
    DeletedAt: string | null;
    details: string | null;
    name: string | null;
};

export type PublisherListResponse = BaseErrorResponse & {
    publishers?: PublisherResponse[];
};