export interface ApiResponse<T> {
  code: number;
  error_message: string | null;
  data: T | null;
}