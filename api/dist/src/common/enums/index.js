"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditAction = exports.AddressType = exports.PrescriptionStatus = exports.PaymentStatus = exports.PaymentMethod = exports.OrderStatus = exports.DosageForm = exports.ProductStatus = exports.UserStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["CUSTOMER"] = "CUSTOMER";
    UserRole["ADMIN"] = "ADMIN";
    UserRole["PHARMACIST"] = "PHARMACIST";
    UserRole["STAFF"] = "STAFF";
})(UserRole || (exports.UserRole = UserRole = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "ACTIVE";
    UserStatus["INACTIVE"] = "INACTIVE";
    UserStatus["BLOCKED"] = "BLOCKED";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
var ProductStatus;
(function (ProductStatus) {
    ProductStatus["ACTIVE"] = "ACTIVE";
    ProductStatus["INACTIVE"] = "INACTIVE";
    ProductStatus["OUT_OF_STOCK"] = "OUT_OF_STOCK";
})(ProductStatus || (exports.ProductStatus = ProductStatus = {}));
var DosageForm;
(function (DosageForm) {
    DosageForm["TABLET"] = "TABLET";
    DosageForm["CAPSULE"] = "CAPSULE";
    DosageForm["SYRUP"] = "SYRUP";
    DosageForm["SUSPENSION"] = "SUSPENSION";
    DosageForm["INJECTION"] = "INJECTION";
    DosageForm["CREAM"] = "CREAM";
    DosageForm["OINTMENT"] = "OINTMENT";
    DosageForm["GEL"] = "GEL";
    DosageForm["DROPS"] = "DROPS";
    DosageForm["INHALER"] = "INHALER";
    DosageForm["SUPPOSITORY"] = "SUPPOSITORY";
    DosageForm["POWDER"] = "POWDER";
    DosageForm["SOLUTION"] = "SOLUTION";
    DosageForm["SPRAY"] = "SPRAY";
    DosageForm["DEVICE"] = "DEVICE";
    DosageForm["OTHER"] = "OTHER";
})(DosageForm || (exports.DosageForm = DosageForm = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "PENDING";
    OrderStatus["PRESCRIPTION_REVIEW_PENDING"] = "PRESCRIPTION_REVIEW_PENDING";
    OrderStatus["PRESCRIPTION_APPROVED"] = "PRESCRIPTION_APPROVED";
    OrderStatus["PRESCRIPTION_REJECTED"] = "PRESCRIPTION_REJECTED";
    OrderStatus["PAYMENT_PENDING"] = "PAYMENT_PENDING";
    OrderStatus["PAYMENT_VERIFICATION_PENDING"] = "PAYMENT_VERIFICATION_PENDING";
    OrderStatus["PROCESSING"] = "PROCESSING";
    OrderStatus["PACKED"] = "PACKED";
    OrderStatus["SHIPPED"] = "SHIPPED";
    OrderStatus["OUT_FOR_DELIVERY"] = "OUT_FOR_DELIVERY";
    OrderStatus["DELIVERED"] = "DELIVERED";
    OrderStatus["CANCELLED"] = "CANCELLED";
    OrderStatus["FAILED"] = "FAILED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["BKASH"] = "BKASH";
    PaymentMethod["NAGAD"] = "NAGAD";
    PaymentMethod["ROCKET"] = "ROCKET";
    PaymentMethod["COD"] = "COD";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["SUBMITTED"] = "SUBMITTED";
    PaymentStatus["VERIFIED"] = "VERIFIED";
    PaymentStatus["REJECTED"] = "REJECTED";
    PaymentStatus["COD_PENDING"] = "COD_PENDING";
    PaymentStatus["PAID"] = "PAID";
    PaymentStatus["REFUNDED"] = "REFUNDED";
    PaymentStatus["FAILED"] = "FAILED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var PrescriptionStatus;
(function (PrescriptionStatus) {
    PrescriptionStatus["PENDING"] = "PENDING";
    PrescriptionStatus["APPROVED"] = "APPROVED";
    PrescriptionStatus["PARTIALLY_APPROVED"] = "PARTIALLY_APPROVED";
    PrescriptionStatus["REJECTED"] = "REJECTED";
    PrescriptionStatus["NEEDS_CLARIFICATION"] = "NEEDS_CLARIFICATION";
    PrescriptionStatus["EXPIRED"] = "EXPIRED";
})(PrescriptionStatus || (exports.PrescriptionStatus = PrescriptionStatus = {}));
var AddressType;
(function (AddressType) {
    AddressType["HOME"] = "HOME";
    AddressType["OFFICE"] = "OFFICE";
    AddressType["OTHER"] = "OTHER";
})(AddressType || (exports.AddressType = AddressType = {}));
var AuditAction;
(function (AuditAction) {
    AuditAction["CREATE"] = "CREATE";
    AuditAction["UPDATE"] = "UPDATE";
    AuditAction["DELETE"] = "DELETE";
    AuditAction["APPROVE"] = "APPROVE";
    AuditAction["REJECT"] = "REJECT";
    AuditAction["LOGIN"] = "LOGIN";
    AuditAction["LOGOUT"] = "LOGOUT";
    AuditAction["VERIFY"] = "VERIFY";
    AuditAction["STATUS_CHANGE"] = "STATUS_CHANGE";
})(AuditAction || (exports.AuditAction = AuditAction = {}));
//# sourceMappingURL=index.js.map