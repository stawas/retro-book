import { AuthorResponse } from "./author.response";
import { BaseErrorResponse } from "./base-error.response";
import { PublisherResponse } from "./publisher.response";

export type BookResponse = BaseErrorResponse & {
	ID?: number | null;
	CreatedAt?: string | null;
	UpdatedAt?: string | null;
	DeletedAt?: string | null;
	name?: string | null;
	description?: string | null;
	price?: number | null;
	publisherID?: number | null;
	publisher?: PublisherResponse | null;
	authors?: AuthorResponse[] | null;
};

export type BookListResponse = BaseErrorResponse & {
	books?: BookResponse[];
};

