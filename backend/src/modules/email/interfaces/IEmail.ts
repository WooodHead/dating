export interface IEmail {
    from?: string,
    to: string[],
    subject: string,
    text?: string,
    template?: string,

    [key: string]: any
}
