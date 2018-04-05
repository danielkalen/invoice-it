'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _common = require('./common');

var _common2 = _interopRequireDefault(_common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Emitter extends _common2.default {
  constructor(emitter) {
    super();
    this.name = emitter ? emitter.name : '';
    this.street_number = emitter ? emitter.street_number : '';
    this.street_name = emitter ? emitter.street_name : '';
    this.zip_code = emitter ? emitter.zip_code : '';
    this.city = emitter ? emitter.city : '';
    this.phone = emitter ? emitter.phone : '';
    this.mail = emitter ? emitter.mail : '';
    this.website = emitter ? emitter.website : '';
    this.hydrate(emitter, this._itemsToHydrate());
  }

  get name() {
    return this._company_name;
  }

  set name(value) {
    this._company_name = value;
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

  get website() {
    return this._website;
  }

  set website(value) {
    this._website = value;
  }

  _itemsToHydrate() {
    return ['name', 'street_number', 'street_name', 'zip_code', 'city', 'country', 'phone', 'mail', 'website'];
  }
}
exports.default = Emitter;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGFzc2VzL2VtaXR0ZXIuanMiXSwibmFtZXMiOlsiRW1pdHRlciIsImNvbnN0cnVjdG9yIiwiZW1pdHRlciIsIm5hbWUiLCJzdHJlZXRfbnVtYmVyIiwic3RyZWV0X25hbWUiLCJ6aXBfY29kZSIsImNpdHkiLCJwaG9uZSIsIm1haWwiLCJ3ZWJzaXRlIiwiaHlkcmF0ZSIsIl9pdGVtc1RvSHlkcmF0ZSIsIl9jb21wYW55X25hbWUiLCJ2YWx1ZSIsIl9zdHJlZXRfbnVtYmVyIiwiX3N0cmVldF9uYW1lIiwiX3ppcF9jb2RlIiwiX2NpdHkiLCJjb3VudHJ5IiwiX2NvdW50cnkiLCJfcGhvbmUiLCJfbWFpbCIsIl93ZWJzaXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7Ozs7O0FBRWUsTUFBTUEsT0FBTiwwQkFBNkI7QUFDMUNDLGNBQVlDLE9BQVosRUFBcUI7QUFDbkI7QUFDQSxTQUFLQyxJQUFMLEdBQWFELE9BQUQsR0FBWUEsUUFBUUMsSUFBcEIsR0FBMkIsRUFBdkM7QUFDQSxTQUFLQyxhQUFMLEdBQXNCRixPQUFELEdBQVlBLFFBQVFFLGFBQXBCLEdBQW9DLEVBQXpEO0FBQ0EsU0FBS0MsV0FBTCxHQUFvQkgsT0FBRCxHQUFZQSxRQUFRRyxXQUFwQixHQUFrQyxFQUFyRDtBQUNBLFNBQUtDLFFBQUwsR0FBaUJKLE9BQUQsR0FBWUEsUUFBUUksUUFBcEIsR0FBK0IsRUFBL0M7QUFDQSxTQUFLQyxJQUFMLEdBQWFMLE9BQUQsR0FBWUEsUUFBUUssSUFBcEIsR0FBMkIsRUFBdkM7QUFDQSxTQUFLQyxLQUFMLEdBQWNOLE9BQUQsR0FBWUEsUUFBUU0sS0FBcEIsR0FBNEIsRUFBekM7QUFDQSxTQUFLQyxJQUFMLEdBQWFQLE9BQUQsR0FBWUEsUUFBUU8sSUFBcEIsR0FBMkIsRUFBdkM7QUFDQSxTQUFLQyxPQUFMLEdBQWdCUixPQUFELEdBQVlBLFFBQVFRLE9BQXBCLEdBQThCLEVBQTdDO0FBQ0EsU0FBS0MsT0FBTCxDQUFhVCxPQUFiLEVBQXNCLEtBQUtVLGVBQUwsRUFBdEI7QUFDRDs7QUFFRCxNQUFJVCxJQUFKLEdBQVc7QUFDVCxXQUFPLEtBQUtVLGFBQVo7QUFDRDs7QUFFRCxNQUFJVixJQUFKLENBQVNXLEtBQVQsRUFBZ0I7QUFDZCxTQUFLRCxhQUFMLEdBQXFCQyxLQUFyQjtBQUNEOztBQUVELE1BQUlWLGFBQUosR0FBb0I7QUFDbEIsV0FBTyxLQUFLVyxjQUFaO0FBQ0Q7O0FBRUQsTUFBSVgsYUFBSixDQUFrQlUsS0FBbEIsRUFBeUI7QUFDdkIsU0FBS0MsY0FBTCxHQUFzQkQsS0FBdEI7QUFDRDs7QUFFRCxNQUFJVCxXQUFKLEdBQWtCO0FBQ2hCLFdBQU8sS0FBS1csWUFBWjtBQUNEOztBQUVELE1BQUlYLFdBQUosQ0FBZ0JTLEtBQWhCLEVBQXVCO0FBQ3JCLFNBQUtFLFlBQUwsR0FBb0JGLEtBQXBCO0FBQ0Q7O0FBRUQsTUFBSVIsUUFBSixHQUFlO0FBQ2IsV0FBTyxLQUFLVyxTQUFaO0FBQ0Q7O0FBRUQsTUFBSVgsUUFBSixDQUFhUSxLQUFiLEVBQW9CO0FBQ2xCLFNBQUtHLFNBQUwsR0FBaUJILEtBQWpCO0FBQ0Q7O0FBRUQsTUFBSVAsSUFBSixHQUFXO0FBQ1QsV0FBTyxLQUFLVyxLQUFaO0FBQ0Q7O0FBRUQsTUFBSVgsSUFBSixDQUFTTyxLQUFULEVBQWdCO0FBQ2QsU0FBS0ksS0FBTCxHQUFhSixLQUFiO0FBQ0Q7O0FBRUQsTUFBSUssT0FBSixHQUFjO0FBQ1osV0FBTyxLQUFLQyxRQUFaO0FBQ0Q7O0FBRUQsTUFBSUQsT0FBSixDQUFZTCxLQUFaLEVBQW1CO0FBQ2pCLFNBQUtNLFFBQUwsR0FBZ0JOLEtBQWhCO0FBQ0Q7O0FBRUQsTUFBSU4sS0FBSixHQUFZO0FBQ1YsV0FBTyxLQUFLYSxNQUFaO0FBQ0Q7O0FBRUQsTUFBSWIsS0FBSixDQUFVTSxLQUFWLEVBQWlCO0FBQ2YsU0FBS08sTUFBTCxHQUFjUCxLQUFkO0FBQ0Q7O0FBRUQsTUFBSUwsSUFBSixHQUFXO0FBQ1QsV0FBTyxLQUFLYSxLQUFaO0FBQ0Q7O0FBRUQsTUFBSWIsSUFBSixDQUFTSyxLQUFULEVBQWdCO0FBQ2QsU0FBS1EsS0FBTCxHQUFhUixLQUFiO0FBQ0Q7O0FBRUQsTUFBSUosT0FBSixHQUFjO0FBQ1osV0FBTyxLQUFLYSxRQUFaO0FBQ0Q7O0FBRUQsTUFBSWIsT0FBSixDQUFZSSxLQUFaLEVBQW1CO0FBQ2pCLFNBQUtTLFFBQUwsR0FBZ0JULEtBQWhCO0FBQ0Q7O0FBRURGLG9CQUFrQjtBQUNoQixXQUFPLENBQUMsTUFBRCxFQUFTLGVBQVQsRUFBMEIsYUFBMUIsRUFBeUMsVUFBekMsRUFBcUQsTUFBckQsRUFBNkQsU0FBN0QsRUFBd0UsT0FBeEUsRUFBaUYsTUFBakYsRUFBeUYsU0FBekYsQ0FBUDtBQUNEO0FBeEZ5QztrQkFBdkJaLE8iLCJmaWxlIjoiZW1pdHRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDb21tb24gZnJvbSAnLi9jb21tb24nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbWl0dGVyIGV4dGVuZHMgQ29tbW9uIHtcbiAgY29uc3RydWN0b3IoZW1pdHRlcikge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5uYW1lID0gKGVtaXR0ZXIpID8gZW1pdHRlci5uYW1lIDogJyc7XG4gICAgdGhpcy5zdHJlZXRfbnVtYmVyID0gKGVtaXR0ZXIpID8gZW1pdHRlci5zdHJlZXRfbnVtYmVyIDogJyc7XG4gICAgdGhpcy5zdHJlZXRfbmFtZSA9IChlbWl0dGVyKSA/IGVtaXR0ZXIuc3RyZWV0X25hbWUgOiAnJztcbiAgICB0aGlzLnppcF9jb2RlID0gKGVtaXR0ZXIpID8gZW1pdHRlci56aXBfY29kZSA6ICcnO1xuICAgIHRoaXMuY2l0eSA9IChlbWl0dGVyKSA/IGVtaXR0ZXIuY2l0eSA6ICcnO1xuICAgIHRoaXMucGhvbmUgPSAoZW1pdHRlcikgPyBlbWl0dGVyLnBob25lIDogJyc7XG4gICAgdGhpcy5tYWlsID0gKGVtaXR0ZXIpID8gZW1pdHRlci5tYWlsIDogJyc7XG4gICAgdGhpcy53ZWJzaXRlID0gKGVtaXR0ZXIpID8gZW1pdHRlci53ZWJzaXRlIDogJyc7XG4gICAgdGhpcy5oeWRyYXRlKGVtaXR0ZXIsIHRoaXMuX2l0ZW1zVG9IeWRyYXRlKCkpO1xuICB9XG5cbiAgZ2V0IG5hbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbXBhbnlfbmFtZTtcbiAgfVxuXG4gIHNldCBuYW1lKHZhbHVlKSB7XG4gICAgdGhpcy5fY29tcGFueV9uYW1lID0gdmFsdWU7XG4gIH1cblxuICBnZXQgc3RyZWV0X251bWJlcigpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RyZWV0X251bWJlcjtcbiAgfVxuXG4gIHNldCBzdHJlZXRfbnVtYmVyKHZhbHVlKSB7XG4gICAgdGhpcy5fc3RyZWV0X251bWJlciA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IHN0cmVldF9uYW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9zdHJlZXRfbmFtZTtcbiAgfVxuXG4gIHNldCBzdHJlZXRfbmFtZSh2YWx1ZSkge1xuICAgIHRoaXMuX3N0cmVldF9uYW1lID0gdmFsdWU7XG4gIH1cblxuICBnZXQgemlwX2NvZGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3ppcF9jb2RlO1xuICB9XG5cbiAgc2V0IHppcF9jb2RlKHZhbHVlKSB7XG4gICAgdGhpcy5femlwX2NvZGUgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBjaXR5KCkge1xuICAgIHJldHVybiB0aGlzLl9jaXR5O1xuICB9XG5cbiAgc2V0IGNpdHkodmFsdWUpIHtcbiAgICB0aGlzLl9jaXR5ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgY291bnRyeSgpIHtcbiAgICByZXR1cm4gdGhpcy5fY291bnRyeTtcbiAgfVxuXG4gIHNldCBjb3VudHJ5KHZhbHVlKSB7XG4gICAgdGhpcy5fY291bnRyeSA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IHBob25lKCkge1xuICAgIHJldHVybiB0aGlzLl9waG9uZTtcbiAgfVxuXG4gIHNldCBwaG9uZSh2YWx1ZSkge1xuICAgIHRoaXMuX3Bob25lID0gdmFsdWU7XG4gIH1cblxuICBnZXQgbWFpbCgpIHtcbiAgICByZXR1cm4gdGhpcy5fbWFpbDtcbiAgfVxuXG4gIHNldCBtYWlsKHZhbHVlKSB7XG4gICAgdGhpcy5fbWFpbCA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IHdlYnNpdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3dlYnNpdGU7XG4gIH1cblxuICBzZXQgd2Vic2l0ZSh2YWx1ZSkge1xuICAgIHRoaXMuX3dlYnNpdGUgPSB2YWx1ZTtcbiAgfVxuXG4gIF9pdGVtc1RvSHlkcmF0ZSgpIHtcbiAgICByZXR1cm4gWyduYW1lJywgJ3N0cmVldF9udW1iZXInLCAnc3RyZWV0X25hbWUnLCAnemlwX2NvZGUnLCAnY2l0eScsICdjb3VudHJ5JywgJ3Bob25lJywgJ21haWwnLCAnd2Vic2l0ZSddO1xuICB9XG59XG4iXX0=