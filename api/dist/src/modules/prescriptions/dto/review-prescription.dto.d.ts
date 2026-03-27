export declare enum ReviewStatus {
    APPROVED = "APPROVED",
    PARTIALLY_APPROVED = "PARTIALLY_APPROVED",
    REJECTED = "REJECTED",
    NEEDS_CLARIFICATION = "NEEDS_CLARIFICATION"
}
export declare class ReviewPrescriptionDto {
    status: ReviewStatus;
    pharmacistNote?: string;
}
