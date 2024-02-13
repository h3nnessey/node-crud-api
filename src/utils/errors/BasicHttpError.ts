export class BasicHttpError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly statusMessage: string,
    public readonly message: string,
  ) {
    super(message);
  }
}
