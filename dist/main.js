"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _calendar = _interopRequireDefault(require("./calendar.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
// Export DatePicker globally
window.DatePicker = _calendar["default"];
var _default = exports["default"] = _calendar["default"];