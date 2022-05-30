export interface IFakeHttpRequest<T> {
    url: string;
    method: string; // trenger ikke om dette kun skal brukes i get ting, men da trenger vi en egen for å lagre det som skal gjøres ved upload
    params: Record<string, string>;
    data: T;
    headers: Record<string, string>; // Trenger vi headers?
}
