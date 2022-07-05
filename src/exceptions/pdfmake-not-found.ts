export class PdfmakeNotFound extends Error {
    constructor(msg: string) {
        super(msg);
        this.name = 'PdfmakeNotFound';
    }
}
