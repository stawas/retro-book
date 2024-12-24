import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import invariant from "tiny-invariant";
import { requestAllAuthors } from "~/data/authors.remote";
import { editBook, requestBook } from "~/data/books.remote";
import { requestAllPublishers } from "~/data/publishers.remote";
import {
	AuthorListResponse,
	AuthorResponse,
} from "~/data/response/author.response";
import { BookResponse } from "~/data/response/book.response";
import { UpdateBookResponse } from "~/data/response/create-book.response";
import {
	PublisherListResponse,
	PublisherResponse,
} from "~/data/response/publisher.response";
import { commitSession, error, getSession } from "~/sessions";
import { isNullOrEmpty, toBookRequest } from "~/utils";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
	invariant(params.bookId, "Missing bookId param");
	const publishers: PublisherListResponse | null = await requestAllPublishers(
		request
	);
	const authors: AuthorListResponse | null = await requestAllAuthors(request);
	if (publishers.isError) {
		throw new Response(publishers.errorMessage, { status: 404 });
	}
	if (authors.isError) {
		throw new Response(authors.errorMessage, { status: 404 });
	}
	const book: BookResponse | null = await requestBook(request, params.bookId);
	if (book.isError) {
		throw new Response(book.errorMessage, { status: 404 });
	}
	return Response.json({
		book: book,
		publishers: publishers,
		authors: authors,
	});
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
	invariant(params.bookId, "Missing bookId param");
	const session = await getSession(request.headers.get("Cookie"));
	const formData: FormData = await request.formData();
	const response: UpdateBookResponse = await editBook(
		request,
		params.bookId,
		toBookRequest({ formData: formData })
	);
	if (response.isError) {
		session.flash(error, response.errorMessage ?? "");
		return redirect(`/books/${params.bookId}/edit`, {
			headers: {
				"Set-Cookie": await commitSession(session),
			},
		});
	}
	return redirect(`/books/${response.bookId}`);
};

export default function EditBook() {
	const {
		book,
		publishers,
		authors,
	}: {
		book: BookResponse;
		publishers: PublisherListResponse;
		authors: AuthorListResponse;
	} = useLoaderData<typeof loader>();
	const showPublishers: boolean = !isNullOrEmpty(publishers.publishers);
	const showAuthors: boolean = !isNullOrEmpty(authors.authors);
	const navigate = useNavigate();
	return (
		<div>
			<h1>Edit book!</h1>
			<Form
				className="container direction-column spacing-v-16"
				method="put"
			>
				<label className="container direction-column">
					<span>Name</span>
					<input
						aria-label="Book name"
						name="name"
						defaultValue={book.name ?? ""}
						placeholder="Book name"
						type="text"
						required
					/>
				</label>
				<label className="container direction-column">
					<span>Description</span>
					<textarea
						aria-label="Book description"
						name="description"
						defaultValue={book.description ?? ""}
						placeholder="Book description"
						required
					/>
				</label>
				<label className="container direction-column">
					<span>Price (THB)</span>
					<input
						aria-label="Book price"
						name="price"
						defaultValue={book.price ?? 0}
						placeholder="Book price"
						type="number"
						required
					/>
				</label>
				{showPublishers ? (
					<label className="container direction-column">
						<span>Publisher</span>
						<select
							name="publisherID"
							required
						>
							{publishers.publishers?.map(
								(item: PublisherResponse) => (
									<option
										key={item.ID}
										value={item.ID ?? ""}
									selected={item.ID === book.publisherID}>
										{item.name ?? ""}
									</option>
								)
							)}
						</select>
					</label>
				) : (
					<p>
						No publisher in system. plase contact support to create
						publisher first
					</p>
				)}
				{showAuthors ? (
					<label className="container direction-column">
						<span>Author</span>
						<select
							name="authorIDs"
							size={authors.authors?.length}
							multiple
							required
						>
							{authors.authors?.map((item: AuthorResponse) => (
								<option
									key={item.ID}
									value={item.ID ?? ""}
									selected={book.authors?.some((author)=>item.ID === author.ID)}
								>
									{item.name ?? ""}
								</option>
							))}
						</select>
						<span>
							Hold down the Ctrl (windows) / Command (Mac) button
							to select multiple options. You can drag mouse to
							select multiple options.
						</span>
					</label>
				) : (
					<p>
						No author in system. plase contact support to create
						author first
					</p>
				)}
				<button type="submit">Save</button>
				<button
					onClick={() => navigate(-1)}
					type="button"
				>
					Cancel
				</button>
			</Form>
		</div>
	);
}
