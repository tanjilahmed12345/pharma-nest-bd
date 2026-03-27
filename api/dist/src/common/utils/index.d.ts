export declare function generateOrderNumber(): string;
export declare function slugify(text: string): string;
export declare function paginateResult<T>(data: T[], total: number, page: number, pageSize: number): {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
};
