import { isRouteErrorResponse } from "@remix-run/react";
import { User } from "app/model/users.model";
import { BookRequest } from "./data/request/book.request";

export function toUserModel({ formData }: { formData: FormData }): User {
	const email = formData.get("email");
	const password = formData.get("password");
	if (email! instanceof String && password! instanceof String) {
		return {
			Email: "",
			Password: "",
		};
	}
	return {
		Email: email as string,
		Password: password as string,
	};
}

export function toBookRequest({ formData }: { formData: FormData }): BookRequest {
	const name = formData.get("name");
	const description = formData.get("description");
	const price = formData.get("price");
	const publisherID = formData.get("publisherID");
	const authorIDs = formData.getAll("authorIDs");
	
	return {
		name: name as string,
		description: description as string,
		price: Number(price), 
		publisherID: Number(publisherID), 
		authorIDs: authorIDs.map(id => Number(id)), 
	};
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function devLog(message?: any, ...optionalParams: any[]) {
	if (process.env.NODE_ENV === "production") return;
	console.log(message, ...optionalParams);
}

export function isNullOrEmptyOrBlank(
	value: string | null | undefined
): boolean {
	if (value == undefined) return true;
	if (value == null) return true;
	if (value === "") return true;
	if (value.trim() === "") return true;
	return false;
}

export function isNull(value: number | null | undefined): boolean {
	if (value == undefined) return true;
	if (value == null) return true;
	return false;
}

export function isNullOrEmpty<T>(value: T[] | null | undefined): boolean {
	if (value == undefined) return true;
	if (value == null) return true;
	if (value.length === 0) return true;
	return false;
}

export function getErrorMessage(error: unknown): string {
	let errorMessage: string = "Unknown error";
	if (isRouteErrorResponse(error)) {
		errorMessage = error.data || error.statusText;
	} else if (error instanceof Error) {
		errorMessage = error.message;
	} else if (typeof error === "string") {
		errorMessage = error;
	} else {
		devLog(error);
		errorMessage = "Unknown error";
	}
	return errorMessage;
}
