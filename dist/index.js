'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classes = require('./classes');

var _classes2 = _interopRequireDefault(_classes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_classes2.default.configure({
  emitter: {
    name: 'Your company',
    street_number: '10',
    street_name: 'wall street',
    zip_code: '77340',
    city: 'New York',
    phone: '01 00 00 00 00',
    mail: 'contact@website.com',
    website: 'www.website.com'
  },
  global: {
    logo: 'http://placehold.it/230x70&text=logo',
    order_reference_pattern: '$prefix{OR}$date{YYMM}$separator{-}$id{00000}',
    invoice_reference_pattern: '$prefix{IN}$date{YYMM}$separator{-}$id{00000}',
    order_template: `${__dirname}/../static/order.pug`,
    order_note: '',
    invoice_template: `${__dirname}/../static/invoice.pug`,
    invoice_note: '',
    date_format: 'MM/DD/YYYY',
    lang: 'en'
  }
});

exports.default = _classes2.default;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJjb25maWd1cmUiLCJlbWl0dGVyIiwibmFtZSIsInN0cmVldF9udW1iZXIiLCJzdHJlZXRfbmFtZSIsInppcF9jb2RlIiwiY2l0eSIsInBob25lIiwibWFpbCIsIndlYnNpdGUiLCJnbG9iYWwiLCJsb2dvIiwib3JkZXJfcmVmZXJlbmNlX3BhdHRlcm4iLCJpbnZvaWNlX3JlZmVyZW5jZV9wYXR0ZXJuIiwib3JkZXJfdGVtcGxhdGUiLCJfX2Rpcm5hbWUiLCJvcmRlcl9ub3RlIiwiaW52b2ljZV90ZW1wbGF0ZSIsImludm9pY2Vfbm90ZSIsImRhdGVfZm9ybWF0IiwibGFuZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7OztBQUVBLGtCQUFVQSxTQUFWLENBQW9CO0FBQ2xCQyxXQUFTO0FBQ1BDLFVBQU0sY0FEQztBQUVQQyxtQkFBZSxJQUZSO0FBR1BDLGlCQUFhLGFBSE47QUFJUEMsY0FBVSxPQUpIO0FBS1BDLFVBQU0sVUFMQztBQU1QQyxXQUFPLGdCQU5BO0FBT1BDLFVBQU0scUJBUEM7QUFRUEMsYUFBUztBQVJGLEdBRFM7QUFXbEJDLFVBQVE7QUFDTkMsVUFBTSxzQ0FEQTtBQUVOQyw2QkFBeUIsK0NBRm5CO0FBR05DLCtCQUEyQiwrQ0FIckI7QUFJTkMsb0JBQWlCLEdBQUVDLFNBQVUsc0JBSnZCO0FBS05DLGdCQUFZLEVBTE47QUFNTkMsc0JBQW1CLEdBQUVGLFNBQVUsd0JBTnpCO0FBT05HLGtCQUFjLEVBUFI7QUFRTkMsaUJBQWEsWUFSUDtBQVNOQyxVQUFNO0FBVEE7QUFYVSxDQUFwQiIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBnZW5lcmF0b3IgZnJvbSAnLi9jbGFzc2VzJztcblxuZ2VuZXJhdG9yLmNvbmZpZ3VyZSh7XG4gIGVtaXR0ZXI6IHtcbiAgICBuYW1lOiAnWW91ciBjb21wYW55JyxcbiAgICBzdHJlZXRfbnVtYmVyOiAnMTAnLFxuICAgIHN0cmVldF9uYW1lOiAnd2FsbCBzdHJlZXQnLFxuICAgIHppcF9jb2RlOiAnNzczNDAnLFxuICAgIGNpdHk6ICdOZXcgWW9yaycsXG4gICAgcGhvbmU6ICcwMSAwMCAwMCAwMCAwMCcsXG4gICAgbWFpbDogJ2NvbnRhY3RAd2Vic2l0ZS5jb20nLFxuICAgIHdlYnNpdGU6ICd3d3cud2Vic2l0ZS5jb20nLFxuICB9LFxuICBnbG9iYWw6IHtcbiAgICBsb2dvOiAnaHR0cDovL3BsYWNlaG9sZC5pdC8yMzB4NzAmdGV4dD1sb2dvJyxcbiAgICBvcmRlcl9yZWZlcmVuY2VfcGF0dGVybjogJyRwcmVmaXh7T1J9JGRhdGV7WVlNTX0kc2VwYXJhdG9yey19JGlkezAwMDAwfScsXG4gICAgaW52b2ljZV9yZWZlcmVuY2VfcGF0dGVybjogJyRwcmVmaXh7SU59JGRhdGV7WVlNTX0kc2VwYXJhdG9yey19JGlkezAwMDAwfScsXG4gICAgb3JkZXJfdGVtcGxhdGU6IGAke19fZGlybmFtZX0vLi4vc3RhdGljL29yZGVyLnB1Z2AsXG4gICAgb3JkZXJfbm90ZTogJycsXG4gICAgaW52b2ljZV90ZW1wbGF0ZTogYCR7X19kaXJuYW1lfS8uLi9zdGF0aWMvaW52b2ljZS5wdWdgLFxuICAgIGludm9pY2Vfbm90ZTogJycsXG4gICAgZGF0ZV9mb3JtYXQ6ICdNTS9ERC9ZWVlZJyxcbiAgICBsYW5nOiAnZW4nLFxuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IGdlbmVyYXRvcjtcbiJdfQ==