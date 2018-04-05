'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _common = require('./common');

var _common2 = _interopRequireDefault(_common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Recipient extends _common2.default {
  constructor(recipient) {
    super();
    this.hydrate(recipient, this._itemsToHydrate());
  }

  get company_name() {
    return this._company_name;
  }

  set company_name(value) {
    this._company_name = value;
  }

  get first_name() {
    return this._first_name;
  }

  set first_name(value) {
    this._first_name = value;
  }

  get last_name() {
    return this._last_name;
  }

  set last_name(value) {
    this._last_name = value;
  }

  get street_number() {
    return this._street_number;
  }

  set street_number(value) {
    this._street_number = value;
  }

  get street_name() {
    return this._street_name;
  }

  set street_name(value) {
    this._street_name = value;
  }

  get zip_code() {
    return this._zip_code;
  }

  set zip_code(value) {
    this._zip_code = value;
  }

  get city() {
    return this._city;
  }

  set city(value) {
    this._city = value;
  }

  get country() {
    return this._country;
  }

  set country(value) {
    this._country = value;
  }

  get phone() {
    return this._phone;
  }

  set phone(value) {
    this._phone = value;
  }

  get mail() {
    return this._mail;
  }

  set mail(value) {
    this._mail = value;
  }

  _itemsToHydrate() {
    return ['company_name', 'first_name', 'last_name', 'street_number', 'street_name', 'zip_code', 'city', 'country', 'phone', 'mail'];
  }
}
exports.default = Recipient;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGFzc2VzL3JlY2lwaWVudC5qcyJdLCJuYW1lcyI6WyJSZWNpcGllbnQiLCJjb25zdHJ1Y3RvciIsInJlY2lwaWVudCIsImh5ZHJhdGUiLCJfaXRlbXNUb0h5ZHJhdGUiLCJjb21wYW55X25hbWUiLCJfY29tcGFueV9uYW1lIiwidmFsdWUiLCJmaXJzdF9uYW1lIiwiX2ZpcnN0X25hbWUiLCJsYXN0X25hbWUiLCJfbGFzdF9uYW1lIiwic3RyZWV0X251bWJlciIsIl9zdHJlZXRfbnVtYmVyIiwic3RyZWV0X25hbWUiLCJfc3RyZWV0X25hbWUiLCJ6aXBfY29kZSIsIl96aXBfY29kZSIsImNpdHkiLCJfY2l0eSIsImNvdW50cnkiLCJfY291bnRyeSIsInBob25lIiwiX3Bob25lIiwibWFpbCIsIl9tYWlsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7Ozs7O0FBRWUsTUFBTUEsU0FBTiwwQkFBK0I7QUFDNUNDLGNBQVlDLFNBQVosRUFBdUI7QUFDckI7QUFDQSxTQUFLQyxPQUFMLENBQWFELFNBQWIsRUFBd0IsS0FBS0UsZUFBTCxFQUF4QjtBQUNEOztBQUVELE1BQUlDLFlBQUosR0FBbUI7QUFDakIsV0FBTyxLQUFLQyxhQUFaO0FBQ0Q7O0FBRUQsTUFBSUQsWUFBSixDQUFpQkUsS0FBakIsRUFBd0I7QUFDdEIsU0FBS0QsYUFBTCxHQUFxQkMsS0FBckI7QUFDRDs7QUFFRCxNQUFJQyxVQUFKLEdBQWlCO0FBQ2YsV0FBTyxLQUFLQyxXQUFaO0FBQ0Q7O0FBRUQsTUFBSUQsVUFBSixDQUFlRCxLQUFmLEVBQXNCO0FBQ3BCLFNBQUtFLFdBQUwsR0FBbUJGLEtBQW5CO0FBQ0Q7O0FBRUQsTUFBSUcsU0FBSixHQUFnQjtBQUNkLFdBQU8sS0FBS0MsVUFBWjtBQUNEOztBQUVELE1BQUlELFNBQUosQ0FBY0gsS0FBZCxFQUFxQjtBQUNuQixTQUFLSSxVQUFMLEdBQWtCSixLQUFsQjtBQUNEOztBQUVELE1BQUlLLGFBQUosR0FBb0I7QUFDbEIsV0FBTyxLQUFLQyxjQUFaO0FBQ0Q7O0FBRUQsTUFBSUQsYUFBSixDQUFrQkwsS0FBbEIsRUFBeUI7QUFDdkIsU0FBS00sY0FBTCxHQUFzQk4sS0FBdEI7QUFDRDs7QUFFRCxNQUFJTyxXQUFKLEdBQWtCO0FBQ2hCLFdBQU8sS0FBS0MsWUFBWjtBQUNEOztBQUVELE1BQUlELFdBQUosQ0FBZ0JQLEtBQWhCLEVBQXVCO0FBQ3JCLFNBQUtRLFlBQUwsR0FBb0JSLEtBQXBCO0FBQ0Q7O0FBRUQsTUFBSVMsUUFBSixHQUFlO0FBQ2IsV0FBTyxLQUFLQyxTQUFaO0FBQ0Q7O0FBRUQsTUFBSUQsUUFBSixDQUFhVCxLQUFiLEVBQW9CO0FBQ2xCLFNBQUtVLFNBQUwsR0FBaUJWLEtBQWpCO0FBQ0Q7O0FBRUQsTUFBSVcsSUFBSixHQUFXO0FBQ1QsV0FBTyxLQUFLQyxLQUFaO0FBQ0Q7O0FBRUQsTUFBSUQsSUFBSixDQUFTWCxLQUFULEVBQWdCO0FBQ2QsU0FBS1ksS0FBTCxHQUFhWixLQUFiO0FBQ0Q7O0FBRUQsTUFBSWEsT0FBSixHQUFjO0FBQ1osV0FBTyxLQUFLQyxRQUFaO0FBQ0Q7O0FBRUQsTUFBSUQsT0FBSixDQUFZYixLQUFaLEVBQW1CO0FBQ2pCLFNBQUtjLFFBQUwsR0FBZ0JkLEtBQWhCO0FBQ0Q7O0FBRUQsTUFBSWUsS0FBSixHQUFZO0FBQ1YsV0FBTyxLQUFLQyxNQUFaO0FBQ0Q7O0FBRUQsTUFBSUQsS0FBSixDQUFVZixLQUFWLEVBQWlCO0FBQ2YsU0FBS2dCLE1BQUwsR0FBY2hCLEtBQWQ7QUFDRDs7QUFFRCxNQUFJaUIsSUFBSixHQUFXO0FBQ1QsV0FBTyxLQUFLQyxLQUFaO0FBQ0Q7O0FBRUQsTUFBSUQsSUFBSixDQUFTakIsS0FBVCxFQUFnQjtBQUNkLFNBQUtrQixLQUFMLEdBQWFsQixLQUFiO0FBQ0Q7O0FBRURILG9CQUFrQjtBQUNoQixXQUFPLENBQUMsY0FBRCxFQUFpQixZQUFqQixFQUErQixXQUEvQixFQUE0QyxlQUE1QyxFQUE2RCxhQUE3RCxFQUE0RSxVQUE1RSxFQUF3RixNQUF4RixFQUFnRyxTQUFoRyxFQUEyRyxPQUEzRyxFQUFvSCxNQUFwSCxDQUFQO0FBQ0Q7QUF4RjJDO2tCQUF6QkosUyIsImZpbGUiOiJyZWNpcGllbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ29tbW9uIGZyb20gJy4vY29tbW9uJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVjaXBpZW50IGV4dGVuZHMgQ29tbW9uIHtcbiAgY29uc3RydWN0b3IocmVjaXBpZW50KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmh5ZHJhdGUocmVjaXBpZW50LCB0aGlzLl9pdGVtc1RvSHlkcmF0ZSgpKTtcbiAgfVxuXG4gIGdldCBjb21wYW55X25hbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbXBhbnlfbmFtZTtcbiAgfVxuXG4gIHNldCBjb21wYW55X25hbWUodmFsdWUpIHtcbiAgICB0aGlzLl9jb21wYW55X25hbWUgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBmaXJzdF9uYW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9maXJzdF9uYW1lO1xuICB9XG5cbiAgc2V0IGZpcnN0X25hbWUodmFsdWUpIHtcbiAgICB0aGlzLl9maXJzdF9uYW1lID0gdmFsdWU7XG4gIH1cblxuICBnZXQgbGFzdF9uYW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9sYXN0X25hbWU7XG4gIH1cblxuICBzZXQgbGFzdF9uYW1lKHZhbHVlKSB7XG4gICAgdGhpcy5fbGFzdF9uYW1lID0gdmFsdWU7XG4gIH1cblxuICBnZXQgc3RyZWV0X251bWJlcigpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RyZWV0X251bWJlcjtcbiAgfVxuXG4gIHNldCBzdHJlZXRfbnVtYmVyKHZhbHVlKSB7XG4gICAgdGhpcy5fc3RyZWV0X251bWJlciA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IHN0cmVldF9uYW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9zdHJlZXRfbmFtZTtcbiAgfVxuXG4gIHNldCBzdHJlZXRfbmFtZSh2YWx1ZSkge1xuICAgIHRoaXMuX3N0cmVldF9uYW1lID0gdmFsdWU7XG4gIH1cblxuICBnZXQgemlwX2NvZGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3ppcF9jb2RlO1xuICB9XG5cbiAgc2V0IHppcF9jb2RlKHZhbHVlKSB7XG4gICAgdGhpcy5femlwX2NvZGUgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBjaXR5KCkge1xuICAgIHJldHVybiB0aGlzLl9jaXR5O1xuICB9XG5cbiAgc2V0IGNpdHkodmFsdWUpIHtcbiAgICB0aGlzLl9jaXR5ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgY291bnRyeSgpIHtcbiAgICByZXR1cm4gdGhpcy5fY291bnRyeTtcbiAgfVxuXG4gIHNldCBjb3VudHJ5KHZhbHVlKSB7XG4gICAgdGhpcy5fY291bnRyeSA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IHBob25lKCkge1xuICAgIHJldHVybiB0aGlzLl9waG9uZTtcbiAgfVxuXG4gIHNldCBwaG9uZSh2YWx1ZSkge1xuICAgIHRoaXMuX3Bob25lID0gdmFsdWU7XG4gIH1cblxuICBnZXQgbWFpbCgpIHtcbiAgICByZXR1cm4gdGhpcy5fbWFpbDtcbiAgfVxuXG4gIHNldCBtYWlsKHZhbHVlKSB7XG4gICAgdGhpcy5fbWFpbCA9IHZhbHVlO1xuICB9XG5cbiAgX2l0ZW1zVG9IeWRyYXRlKCkge1xuICAgIHJldHVybiBbJ2NvbXBhbnlfbmFtZScsICdmaXJzdF9uYW1lJywgJ2xhc3RfbmFtZScsICdzdHJlZXRfbnVtYmVyJywgJ3N0cmVldF9uYW1lJywgJ3ppcF9jb2RlJywgJ2NpdHknLCAnY291bnRyeScsICdwaG9uZScsICdtYWlsJ107XG4gIH1cbn1cbiJdfQ==