export class PdfmakeNotFound extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PdfmakeNotFound';
  }
}
