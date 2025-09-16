import { ApiResponse } from "shared/interfaces/api-response.interface";

export function success<T>(data: T): ApiResponse<T> {
  return {
    code: 201,
    error_message: null,
    data,
  };
}

export function error<T>(code: number, message: string): ApiResponse<T> {
  return {
    code,
    error_message: message,
    data: null,
  };
}