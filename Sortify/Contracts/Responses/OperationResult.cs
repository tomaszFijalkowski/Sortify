using Sortify.Contracts.Requests;
using System;

namespace Sortify.Contracts.Responses
{
    /// <summary>
    /// Result of system processing a request of <see cref="TRequest"/> with corresponding response of <see cref="TResponse"/> 
    /// </summary>
    /// <typeparam name="TRequest">Request for which system returned result</typeparam>
    /// <typeparam name="TResponse">Provided response to result</typeparam>
    public class OperationResult<TRequest, TResponse>
        where TResponse : IResponse<TRequest> where TRequest : IRequest
    {
        /// <summary>
        /// Result data - default(TResponse) if failed
        /// </summary>
        public TResponse Result { get; set; }

        /// <summary>
        /// Status code
        /// </summary>
        public int StatusCode { get; set; }

        /// <summary>
        /// Error message - if failed
        /// </summary>
        public string ErrorMessage { get; set; }

        /// <summary>
        /// Did operation succeed?
        /// </summary>
        public bool Successful => ErrorMessage == null;

        private OperationResult(TResponse result, int statusCode = 200, string errorMessage = null)
        {
            StatusCode = statusCode;
            ErrorMessage = errorMessage;

            if (Successful && result == null)
                throw new ArgumentNullException(nameof(result));

            Result = result;
        }

        /// <summary>
        /// Operation failed
        /// </summary>
        /// <param name="statusCode">Status code</param>
        /// <param name="errorMessage">Error message</param>
        /// <returns></returns>
        public static OperationResult<TRequest, TResponse> Failure(int statusCode, string errorMessage) =>
            new OperationResult<TRequest, TResponse>(default, statusCode, errorMessage);

        /// <summary>
        /// Operation succeeded
        /// </summary>
        /// <param name="result">Result for user</param>
        /// <returns></returns>
        public static OperationResult<TRequest, TResponse> Success(TResponse result) =>
            new OperationResult<TRequest, TResponse>(result);
    }

    /// <summary>
    /// Result of system processing a request of with no response except success indicator
    /// </summary>
    public class OperationResult
    {
        /// <summary>
        /// Status code
        /// </summary>
        public int StatusCode { get; set; }

        /// <summary>
        /// Error message - if failed
        /// </summary>
        public string ErrorMessage { get; set; }

        /// <summary>
        /// Did operation succeed?
        /// </summary>
        public bool Successful => ErrorMessage == null;

        private OperationResult(int statusCode = 200, string errorMessage = null)
        {
            StatusCode = statusCode;
            ErrorMessage = errorMessage;
        }

        /// <summary>
        /// Operation failed
        /// </summary>
        /// <param name="statusCode">Status code</param>
        /// <param name="errorMessage">Error message</param>
        /// <returns></returns>
        public static OperationResult Failure(int statusCode, string errorMessage) =>
            new OperationResult(statusCode, errorMessage);

        /// <summary>
        /// Operation succeeded
        /// </summary>
        /// <returns></returns>
        public static OperationResult Success() =>
            new OperationResult();
    }
}
