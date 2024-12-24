import { createCookieSessionStorage, redirect } from "@remix-run/node";

export const accessToken = "accessToken";
export const error = "error";
type SessionData = {
	accessToken: string;
};

type SessionFlashData = {
	error: string;
};

const { getSession, commitSession, destroySession } =
	createCookieSessionStorage<SessionData, SessionFlashData>({
		// a Cookie from `createCookie` or the CookieOptions to create one
		cookie: {
			name: "__session",
			httpOnly: true,
			path: "/",
			sameSite: "lax",
			secrets: ["lkirkcxe"],
			secure: process.env.NODE_ENV === "production",
		},
	});

export async function requireUserSession(request: Request): Promise<string> {
	const session = await getSession(request.headers.get("Cookie"));

	if (!session.has(accessToken)) {
		throw redirect("/login");
	}

	return session.get(accessToken)!;
}

export { getSession, commitSession, destroySession };
