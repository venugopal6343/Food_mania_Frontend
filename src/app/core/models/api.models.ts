export type Uuid = string;
export type IsoInstant = string;

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: IsoInstant;
}

export interface FieldViolation {
  field: string;
  message: string;
}

export interface ErrorResponse {
  success: false;
  code: string;
  message: string;
  status: number;
  path: string;
  timestamp: IsoInstant;
  errors: FieldViolation[];
}

export interface ApiErrorViewModel {
  title: string;
  message: string;
  status?: number;
  violations: FieldViolation[];
}
