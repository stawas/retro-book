import { baseUrl, bookAPI, scheme } from "app/data/api.endpoint";
import { devLog } from "app/utils";
import {
	BookListResponse,
	BookResponse,
} from "app/data/response/book.response";
import { requireUserSession } from "~/sessions";
import { BookRequest } from "./request/book.request";
import { UpdateBookResponse } from "./response/create-book.response";
import { Result } from "./response/result.response";

export async function requestAllBooks(
	request: Request
): Promise<BookListResponse> {
	const url: URL = new URL(`${scheme}${baseUrl}${bookAPI}/list`);
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

	const result: BookListResponse = responseContent;

	return result;
}

export async function requestBook(
	request: Request,
	id: string
): Promise<BookResponse> {
	const url: URL = new URL(`${scheme}${baseUrl}${bookAPI}/get/${id}`);
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
	const result: BookResponse = responseContent;

	return result;
}

export async function requestBookByQuery(
	request: Request,
	query: string
): Promise<BookListResponse> {
	const url: URL = new URL(`${scheme}${baseUrl}${bookAPI}/search`);
	url.searchParams.append("q", query);
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
	const result: BookResponse = responseContent;

	return result;
}

export async function createBook(
	request: Request,
	body: BookRequest,
): Promise<UpdateBookResponse> {
	const url: URL = new URL(`${scheme}${baseUrl}${bookAPI}/create`);
	const accessToken = await requireUserSession(request);
	const requestOptions: Request = new Request(url, {
		method: "POST",
		headers: {
			Cookie: `jwt=${accessToken}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});
	const response: Response = await fetch(requestOptions);
	if (!response.ok) {
		return await response.json();
	}

	const responseContent = await response.json();
	devLog(responseContent);

	const result: UpdateBookResponse = responseContent;

	return result;
}

export async function editBook(
	request: Request,
	bookId: string,
	body: BookRequest,
): Promise<UpdateBookResponse> {
	const url: URL = new URL(`${scheme}${baseUrl}${bookAPI}/edit/${bookId}`);
	const accessToken = await requireUserSession(request);
	const requestOptions: Request = new Request(url, {
		method: "PUT",
		headers: {
			Cookie: `jwt=${accessToken}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});
	const response: Response = await fetch(requestOptions);
	if (!response.ok) {
		return await response.json();
	}

	const responseContent = await response.json();
	devLog(responseContent);

	const result: UpdateBookResponse = responseContent;

	return result;
}


export async function deleteBook(
	request: Request,
	bookId: string,
): Promise<Result> {
	const url: URL = new URL(`${scheme}${baseUrl}${bookAPI}/delete/${bookId}`);
	const accessToken = await requireUserSession(request);
	const requestOptions: Request = new Request(url, {
		method: "DELETE",
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

	const result: Result = responseContent;

	return result;
}
