import type { LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { Form, useLoaderData, useRouteError } from "@remix-run/react";
import type { FunctionComponent } from "react";

import { requestBook } from "~/data/books.remote";
import { BookResponse } from "~/data/response/book.response";
import {
	getErrorMessage,
	isNull,
	isNullOrEmpty,
	isNullOrEmptyOrBlank,
} from "~/utils";
import { AuthorResponse } from "~/data/response/author.response";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
	invariant(params.bookId, "Missing bookId param");
	const book: BookResponse | null = await requestBook(request, params.bookId);
	if (book.isError) {
		throw new Response(book.errorMessage, { status: 404 });
	}
	return Response.json({ book: book });
};

export default function Book() {
	const { book: book }: { book: BookResponse } =
		useLoaderData<typeof loader>();

	const showAuthors: boolean = !isNullOrEmpty([book.authors]);
	const showBookName: boolean = !isNullOrEmptyOrBlank(book.publisher?.name);
	const showPrice: boolean = !isNull(book.price);
	const showDescription: boolean = !isNullOrEmptyOrBlank(book.description);

	return (
		<div id="contact">
			<div>
				<h1>{book.name ? <>{book.name}</> : <i>No Name</i>}</h1>
				<br />
				{showPrice ? <p>{book.price} THB</p> : null}
				{showDescription ? <p>{book.description}</p> : null}
				{showBookName ? <p>Publish by {book.publisher?.name}</p> : null}
				{showAuthors ? <Authors authors={book.authors!} /> : null}
				<div>
					<Form action="edit">
						<button type="submit">Edit</button>
					</Form>

					<Form
						action="destroy"
						method="post"
						onSubmit={(event) => {
							const response = confirm(
								"Please confirm you want to delete this record."
							);
							if (!response) {
								event.preventDefault();
							}
						}}
					>
						<button type="submit">Delete</button>
					</Form>
				</div>
			</div>
		</div>
	);
}

const Authors: FunctionComponent<{ authors: AuthorResponse[] }> = ({
	authors,
}) => {
	return (
		<div>
			<p>Written by</p>
			<ol>
				{authors.map((author) => (
					<li key={author.ID}>{author.name}</li>
				))}
			</ol>
		</div>
	);
};

export function ErrorBoundary() {
	const error = useRouteError();

	const errorMessage: string = getErrorMessage(error);

	return <h1>{`Error: ${errorMessage} 😡`}</h1>;
}
