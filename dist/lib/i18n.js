'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _i18nFactory = require('i18n-factory');

var _i18nFactory2 = _interopRequireDefault(_i18nFactory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const i18n = _i18nFactory2.default.create();

i18n.configure({
  locales: ['en', 'fr'],
  directory: `${__dirname}/../config/locales`,
  defaultLocale: 'en',
  logWarnFn: message => console.warn('warn', message), // eslint-disable-line no-console
  logErrorFn: message => console.error('error', message) // eslint-disable-line no-console
});

exports.default = i18n;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvaTE4bi5qcyJdLCJuYW1lcyI6WyJpMThuIiwiY3JlYXRlIiwiY29uZmlndXJlIiwibG9jYWxlcyIsImRpcmVjdG9yeSIsIl9fZGlybmFtZSIsImRlZmF1bHRMb2NhbGUiLCJsb2dXYXJuRm4iLCJtZXNzYWdlIiwiY29uc29sZSIsIndhcm4iLCJsb2dFcnJvckZuIiwiZXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7Ozs7QUFFQSxNQUFNQSxPQUFPLHNCQUFZQyxNQUFaLEVBQWI7O0FBRUFELEtBQUtFLFNBQUwsQ0FBZTtBQUNiQyxXQUFTLENBQUMsSUFBRCxFQUFPLElBQVAsQ0FESTtBQUViQyxhQUFZLEdBQUVDLFNBQVUsb0JBRlg7QUFHYkMsaUJBQWUsSUFIRjtBQUliQyxhQUFZQyxPQUFELElBQWFDLFFBQVFDLElBQVIsQ0FBYSxNQUFiLEVBQXFCRixPQUFyQixDQUpYLEVBSTBDO0FBQ3ZERyxjQUFhSCxPQUFELElBQWFDLFFBQVFHLEtBQVIsQ0FBYyxPQUFkLEVBQXVCSixPQUF2QixDQUxaLENBSzZDO0FBTDdDLENBQWY7O2tCQVNlUixJIiwiZmlsZSI6ImkxOG4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgaTE4bkZhY3RvcnkgZnJvbSAnaTE4bi1mYWN0b3J5JztcblxuY29uc3QgaTE4biA9IGkxOG5GYWN0b3J5LmNyZWF0ZSgpO1xuXG5pMThuLmNvbmZpZ3VyZSh7XG4gIGxvY2FsZXM6IFsnZW4nLCAnZnInXSxcbiAgZGlyZWN0b3J5OiBgJHtfX2Rpcm5hbWV9Ly4uL2NvbmZpZy9sb2NhbGVzYCxcbiAgZGVmYXVsdExvY2FsZTogJ2VuJyxcbiAgbG9nV2FybkZuOiAobWVzc2FnZSkgPT4gY29uc29sZS53YXJuKCd3YXJuJywgbWVzc2FnZSksIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICBsb2dFcnJvckZuOiAobWVzc2FnZSkgPT4gY29uc29sZS5lcnJvcignZXJyb3InLCBtZXNzYWdlKSwgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG59KTtcblxuXG5leHBvcnQgZGVmYXVsdCBpMThuO1xuIl19