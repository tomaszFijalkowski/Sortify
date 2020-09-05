export interface OperationResult<TResponse> {
  result: TResponse;
  errorMessage: string;
  successful: boolean;
}
