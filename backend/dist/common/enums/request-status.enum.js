"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestStatus = void 0;
var RequestStatus;
(function (RequestStatus) {
    RequestStatus["NEW"] = "new";
    RequestStatus["AWAITING_APPROVAL"] = "awaiting_approval";
    RequestStatus["APPROVED"] = "approved";
    RequestStatus["REJECTED"] = "rejected";
    RequestStatus["IN_PROGRESS"] = "in_progress";
    RequestStatus["PARTS_ORDERED"] = "parts_ordered";
    RequestStatus["PARTS_RECEIVED"] = "parts_received";
    RequestStatus["COMPLETED"] = "completed";
    RequestStatus["CLOSED"] = "closed";
})(RequestStatus || (exports.RequestStatus = RequestStatus = {}));
//# sourceMappingURL=request-status.enum.js.map