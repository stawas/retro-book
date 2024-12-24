import { baseUrl, publisherAPI, scheme } from "app/data/api.endpoint";
import { devLog } from "app/utils";
import { requireUserSession } from "~/sessions";
import { PublisherListResponse } from "./response/publisher.response";

export async function requestAllPublishers(
	request: Request
): Promise<PublisherListResponse> {
	const url: URL = new URL(`${scheme}${baseUrl}${publisherAPI}/list`);
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

	const result: PublisherListResponse = responseContent;

	return result;
}
