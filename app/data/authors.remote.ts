import { authorAPI, baseUrl, scheme } from "app/data/api.endpoint";
import { devLog } from "app/utils";
import { requireUserSession } from "~/sessions";
import { AuthorListResponse } from "./response/author.response";

export async function requestAllAuthors(
	request: Request
): Promise<AuthorListResponse> {
	const url: URL = new URL(`${scheme}${baseUrl}${authorAPI}/list`);
	const accessToken = await requireUserSession(request);
	const requestOptions: Request = new Request(url, {
		method: "GET",
		headers: {
			Cookie: `jwt=${accessToken}`,
			"Content-Type": "application/json",
		},
	});
	const response: Response = await fetch(requestOptions);
	if (!response.ok) {
		return await response.json();
	}

	const responseContent = await response.json();
	devLog(responseContent);

	const result: AuthorListResponse = responseContent;

	return result;
}