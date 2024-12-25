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
import { FunctionComponent } from "react";
import { RetroInput } from "~/ui/retro-input";

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
			content: "Login page",
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
		<div className="flex flex-col gap-2 h-full justify-center items-center">
			<img
				src="./books.gif"
				alt="books"
				width="70"
				height="70"
			/>
			<h1 className="text-base font-bold text-center">Login</h1>
			<form
				method="post"
				className="w-fit"
			>
				<div className="flex flex-col items-center gap-y-2">
					<div className="flex flex-col w-[288px]">
						<div className="flex flex-row flex-grow">
							<div className="flex flex-col flex-grow border border-retro-black bg-retro-white">
								<RetroInput
									id="email"
									name="email"
									label="Email"
									type="text"
									placeholder="Email"
									// defaultValue="spock@example.com"
									isRequired={true}
								/>
								<RetroInput
									id="password"
									name="password"
									label="Password"
									type="password"
									placeholder="Password"
									// defaultValue="ldoiekr983lko39"
									isRequired={true}
								/>
							</div>
							<div className="flex flex-col">
								<div className="h-[4px] w-[4px] bg-transparent"></div>
								<div className="flex-grow w-[4px] bg-retro-black"></div>
							</div>
						</div>
						<div className="flex flex-row">
							<div className="h-[4px] w-[4px] bg-transparent"></div>
							<div className="flex-grow h-[4px] bg-retro-black"></div>
						</div>
					</div>
					{/*avoid using javascript to disabled button. if user has a slow internet or javascript won't load they can't login*/}
					<button
						className="text-base text-retro-link italic font-bold underline"
						type="submit"
					>
						Login
					</button>
					<div className="flex flex-col w-[288px]">
						<div className="flex flex-row flex-grow">
							<div className="flex flex-col flex-grow border border-retro-black bg-retro-red-1">
								{/*You jsx here*/}
								<span className="">Invalid email or password</span>
							</div>
							<div className="flex flex-col">
								<div className="h-[4px] w-[4px] bg-transparent"></div>
								<div className="flex-grow w-[4px] bg-retro-black"></div>
							</div>
						</div>
						<div className="flex flex-row">
							<div className="h-[4px] w-[4px] bg-transparent"></div>
							<div className="flex-grow h-[4px] bg-retro-black"></div>
						</div>
					</div>
					<img
						src="./door.gif"
						alt="books"
						width="130"
						height="163"
					/>
				</div>
			</form>
			{error ? <div className="">{error}</div> : null}
		</div>
	);
}
