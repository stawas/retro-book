import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { requireUserSession } from "app/sessions";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	await requireUserSession(request);
	return redirect(`/books`);
};
