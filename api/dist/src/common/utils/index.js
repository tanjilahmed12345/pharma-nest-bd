"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOrderNumber = generateOrderNumber;
exports.slugify = slugify;
exports.paginateResult = paginateResult;
const constants_1 = require("../constants");
function generateOrderNumber() {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${constants_1.ORDER_NUMBER_PREFIX}-${timestamp}-${random}`;
}
function slugify(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
function paginateResult(data, total, page, pageSize) {
    return {
        data,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
    };
}
//# sourceMappingURL=index.js.map