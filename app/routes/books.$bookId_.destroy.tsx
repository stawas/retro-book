import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { deleteBook } from "~/data/books.remote";

export const action = async ({ params, request }: ActionFunctionArgs) => {
	invariant(params.bookId, "Missing bookId param");
	await deleteBook(request, params.bookId);
	return redirect(`/`);
};
