export type BookRequest = {
    name: string;
    description: string;
    price: number;
    publisherID: number;
    authorIDs: number[];
}