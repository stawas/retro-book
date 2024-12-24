import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	redirect,
} from "@remix-run/node";
import { MetaFunction, useLoaderData } from "@remix-run/react";
import { login } from "app/data/auth.remote";
import { devLog, toUserModel } from "app/utils";
import { accessToken, commitSession, error, getSession } from "app/sessions";
import { LoginResponse } from "~/data/response/login.response";

export async function loader({ request }: LoaderFunctionArgs) {
	const session = await getSession(request.headers.get("Cookie"));

	if (session.has(accessToken)) {
		// Redirect to the home page if they are already signed in.
		return redirect("/books");
	}

	const data = { error: session.get(error) };
	devLog(data);

	return Response.json(data, {
		headers: {
			"Set-Cookie": await commitSession(session),
		},
	});
}

export const action = async ({ request }: ActionFunctionArgs) => {
	const session = await getSession(request.headers.get("Cookie"));
	const formData: FormData = await request.formData();
	const response: LoginResponse = await login(
		toUserModel({ formData: formData })
	);
	if (response.isError === true || response.accessToken === null) {
		session.flash(error, response.errorMessage ?? "");
		// Redirect back to the login page with errors.
		return redirect("/login", {
			headers: {
				"Set-Cookie": await commitSession(session),
			},
		});
	}
	session.set(accessToken, response!.accessToken!);

	// Login succeeded, send them to the home page.
	return redirect("/login", {
		headers: {
			"Set-Cookie": await commitSession(session, {
				expires: response.expires ?? undefined,
			}),
		},
	});
};

export const meta: MetaFunction = () => {
	return [
		{ title: "Login | Retro books" },
		{
			property: "og:title",
			content: "Login | Retro books",
		},
		{
			name: "description",
			content:
				"Login page",
		},
	];
};

/*
Test user
Email:spock@example.com
Password:ldoiekr983lko39
*/

export default function Login() {
	const { error } = useLoaderData<typeof loader>();

	return (
		<div className="container full-width center-main-axis margin-top-16">
			<div className="container direction-column spacing-v-16">
				<p>Login</p>
				<form
					method="post"
					className="container direction-column spacing-v-16"
				>
					<label htmlFor="email">Email</label>
					<input
						id="email"
						name="email"
						type="email"
						required
					/>
					<label htmlFor="password">Password</label>
					<input
						id="password"
						name="password"
						type="password"
						required
					/>
					{/*avoid using javascript to disabled button. if user has a slow internet or javascript won't load they can't login*/}
					<button type="submit">Login</button>
				</form>
				{error ? <div className="error">{error}</div> : null}
			</div>
		</div>
	);
}
