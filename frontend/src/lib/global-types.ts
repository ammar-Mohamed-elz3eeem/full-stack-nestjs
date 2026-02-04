// export interface ErrorResponse {
//   error?: string;
// }

// export interface SuccessResponse<T> {
//   data: T;
// }

export type SuccessResponse<T> = {
  data: T;
};

export type ErrorResponse = {
  error: string;
};

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
