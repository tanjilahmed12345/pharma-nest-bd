export declare enum VerifyStatus {
    VERIFIED = "VERIFIED",
    REJECTED = "REJECTED"
}
export declare class VerifyPaymentDto {
    status: VerifyStatus;
    verificationNote?: string;
}
