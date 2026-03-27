export interface ApiResponseShape<T = any> {
    success: boolean;
    message: string;
    data: T;
}
export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}
export interface PaginationQuery {
    page?: number;
    pageSize?: number;
}
