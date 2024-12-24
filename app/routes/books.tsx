// https://remix.run/docs/en/main/start/tutorial#data-mutations
import type { LoaderFunctionArgs } from "@remix-run/node";
import {
	Form,
	Navigation,
	NavLink,
	Outlet,
	redirect,
	Scripts,
	ScrollRestoration,
	SubmitFunction,
	useLoaderData,
	useNavigation,
	useSubmit,
} from "@remix-run/react";
import { FunctionComponent, useEffect } from "react";

import { requestAllBooks, requestBookByQuery } from "~/data/books.remote";
import { AuthorResponse } from "~/data/response/author.response";
import { BookListResponse } from "~/data/response/book.response";
import { isNullOrEmpty, isNullOrEmptyOrBlank } from "~/utils";

export const action = async () => {
	return redirect(`/books/create`);
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const url: URL = new URL(request.url);
	const q: string | null = url.searchParams.get("q");
	if (isNullOrEmptyOrBlank(q)) {
		const books: BookListResponse = await requestAllBooks(request);
		return Response.json({ books, q });
	} else {
		const books: BookListResponse = await requestBookByQuery(request, q!);
		return Response.json({ books, q });
	}
};

export default function Books() {
	const {
		books,
		q,
	}: {
		books: BookListResponse;
		q: string;
	} = useLoaderData<typeof loader>();
	const navigation: Navigation = useNavigation();
	const submit: SubmitFunction = useSubmit();
	const searching =
		navigation.location &&
		new URLSearchParams(navigation.location.search).has("q");

	useEffect(() => {
		const searchField = document.getElementById("q");
		if (searchField instanceof HTMLInputElement) {
			searchField.value = q || "";
		}
	}, [q]);

	return (
		<div id="book-list">
			<div id="sidebar">
				<div className="bottom-nav space-between">
					<h1 className="remix-logo-before font-regular font-size-larger">
						Remix Books
					</h1>
					<Form
						method="post"
						action="/logout"
					>
						<button type="submit">Logout</button>
					</Form>
				</div>
				<div>
					<Form
						id="search-form"
						onChange={(event) => {
							const isFirstSearch = q === null;
							submit(event.currentTarget, {
								replace: !isFirstSearch,
							});
						}}
						role="search"
					>
						<input
							id="q"
							aria-label="Search books"
							className={searching ? "loading" : ""}
							defaultValue={q || ""}
							placeholder="Search"
							type="search"
							name="q"
						/>
						<div
							id="search-spinner"
							aria-hidden
							hidden={!searching}
						/>
					</Form>
					<Form method="post">
						<button type="submit">New</button>
					</Form>
				</div>
				<nav>
					<BookList books={books} />
				</nav>
			</div>
			<div
				className={
					navigation.state === "loading" && !searching
						? "loading"
						: ""
				}
				id="detail"
			>
				<Outlet />
			</div>
			<ScrollRestoration />
			<Scripts />
		</div>
	);
}

const BookList: FunctionComponent<{ books: BookListResponse }> = ({
	books,
}) => {
	function getAuthorsDisplayText(
		authors: AuthorResponse[] | null | undefined
	): string {
		const totalAuthors: number = authors?.length ?? 0;
		const firstAuthorName: string = authors?.at(0)?.name ?? "";
		if (totalAuthors > 1) {
			return `By ${firstAuthorName} and ${totalAuthors - 1} others`;
		}
		return `By ${firstAuthorName}`;
	}

	function isShowAuthors(
		authors: AuthorResponse[] | null | undefined
	): boolean {
		return !isNullOrEmpty(authors);
	}

	if (books.books?.length) {
		return (
			<ul>
				{books.books?.map((book) => (
					<li key={book.ID}>
						<NavLink
							className={({ isActive, isPending }) =>
								isActive ? "active" : isPending ? "pending" : ""
							}
							to={`./${book.ID}`}
						>
							{book.name ? (
								<>
									{book.name} <br />
									{isShowAuthors(book.authors) ? (
										getAuthorsDisplayText(book.authors)
									) : (
										<></>
									)}
								</>
							) : (
								<i>No Name</i>
							)}
						</NavLink>
					</li>
				))}
			</ul>
		);
	} else {
		return (
			<p>
				<i>No books</i>
			</p>
		);
	}
};
