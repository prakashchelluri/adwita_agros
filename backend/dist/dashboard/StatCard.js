"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StatCard;
function StatCard({ title, value, icon }) {
    return (<div className="p-6 bg-white rounded-lg shadow-md flex items-center space-x-4">
      <div className="p-3 text-blue-500 bg-blue-100 rounded-full">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600 uppercase">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </div>);
}
//# sourceMappingURL=StatCard.js.map