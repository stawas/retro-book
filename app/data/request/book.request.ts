export type BookRequest = {
    name: string;
    description: string;
    price: string;
    publisherID: number;
    authorIDs: number[];
}