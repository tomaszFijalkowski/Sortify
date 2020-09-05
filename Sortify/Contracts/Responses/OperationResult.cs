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
            /// Error message - if failed
            /// </summary>
            public string ErrorMessage { get; set; }

            /// <summary>
            /// Did operation succeed?
            /// </summary>
            public bool Successful => ErrorMessage == null;

            private OperationResult(TResponse result, string errorMessage = null)
            {
                ErrorMessage = errorMessage;

                if (Successful && result == null)
                    throw new ArgumentNullException(nameof(result));

                Result = result;
            }

            /// <summary>
            /// Operation failed
            /// </summary>
            /// <param name="errorMessage">Error message</param>
            /// <returns></returns>
            public static OperationResult<TRequest, TResponse> Failure(string errorMessage) =>
                new OperationResult<TRequest, TResponse>(default, errorMessage);

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
            /// Error message - if failed
            /// </summary>
            public string ErrorMessage { get; set; }

            /// <summary>
            /// Did operation succeed?
            /// </summary>
            public bool Successful => ErrorMessage == null;

            private OperationResult(string errorMessage = null)
            {
                ErrorMessage = errorMessage;
            }

            /// <summary>
            /// Operation failed
            /// </summary>
            /// <param name="errorMessage">Error message</param>
            /// <returns></returns>
            public static OperationResult Failure(string errorMessage) =>
                new OperationResult(errorMessage);

            /// <summary>
            /// Operation succeeded
            /// </summary>
            /// <returns></returns>
            public static OperationResult Success() =>
                new OperationResult();
        }
}
