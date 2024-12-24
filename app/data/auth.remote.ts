import { User } from "~/model/users.model";
import { baseUrl, scheme, userAPI } from "./api.endpoint";
import { LoginResponse } from "./response/login.response";
import { devLog } from "~/utils";

export async function login(user: User): Promise<LoginResponse> {
	const url: URL = new URL(`${scheme}${baseUrl}${userAPI}/login`);
	const body: string = JSON.stringify(user);
	const request: Request = new Request(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: body,
	});
	const response: Response = await fetch(request);
	const responseBody: LoginResponse = await response.json();
	if (!response.ok || responseBody.isError || !responseBody.accessToken) {
		return {
			isError: responseBody.isError,
			errorMessage: responseBody.errorMessage,
		};
	}

	// login response: jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzQ0NTA2OTQsInVzZXJfaWQiOjF9._u_TQUTOKnjhFza5lFyCvASyXwpudD6BBuq9iO3-k0c,expires=Tue, 17 Dec 2024 15:51:34 GMT,path=/,HttpOnly,SameSite=Lax
	const token = responseBody.accessToken!;
	const expires = responseBody.expires ?? "";
	devLog(`
        login response:\n
        jwt: ${token}\n
        expired: ${expires}\n
        `);

	const loginResponse: LoginResponse = {
		isError: responseBody.isError,
		accessToken: token,
		expires: new Date(expires),
	};

	return loginResponse;
}
