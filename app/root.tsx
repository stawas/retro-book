// https://remix.run/docs/en/main/start/tutorial#data-mutations
import type { LinksFunction } from "@remix-run/node";
import {
	Links,
	Meta,
	MetaFunction,
	Outlet,
	Scripts,
	useRouteError,
} from "@remix-run/react";

import stylesheet from "~/tailwind.css?url";
import { getErrorMessage } from "./utils";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: stylesheet  },
];

export const meta: MetaFunction = () => {
	return [
		{ title: "Retro books" },
		{
			property: "og:title",
			content: "Retro books",
		},
		{
			name: "description",
			content:
				"A list of books that can view detail, create, update, delete.",
		},
	];
};

// TODO register
export default function App() {
	return (
		<html lang="en" className="h-full">
			<head>
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<Meta />
				<Links />
			</head>
			<body className="bg-retro-yellow h-full">
				<Outlet />
				<Scripts />
			</body>
		</html>
	);
}

export function ErrorBoundary() {
	const error = useRouteError();

	const errorMessage: string = getErrorMessage(error);

	return (
		<html lang="en">
			<head>
				<title>Oh no!</title>
				<Meta />
				<Links />
			</head>
			<body>
				{/* add the UI you want your users to see */}
				<h1>{`Error: ${errorMessage} 😡`}</h1>
				<Scripts />
			</body>
		</html>
	);
}
