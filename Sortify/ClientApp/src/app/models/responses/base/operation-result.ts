export interface OperationResult<TResponse> {
  result: TResponse;
  statusCode: number;
  errorMessage: string;
  successful: boolean;
}
