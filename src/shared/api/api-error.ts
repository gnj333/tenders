export class ApiError extends Error {
  readonly status: number;
  readonly url: string;
  readonly payload?: unknown;

  constructor(args: { status: number; url: string; message?: string; payload?: unknown }) {
    super(args.message ?? `Request to ${args.url} failed with ${args.status}`);
    this.name = 'ApiError';
    this.status = args.status;
    this.url = args.url;
    this.payload = args.payload;
  }
}
