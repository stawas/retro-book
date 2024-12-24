import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { destroySession, getSession } from "~/sessions";
export const action = async ({ request }: ActionFunctionArgs) => {
	const session = await getSession(request.headers.get("Cookie"));

	return redirect("/login", {
		headers: {
			"Set-Cookie": await destroySession(session),
		},
	});
};
