'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsonOverride = require('json-override');

var _jsonOverride2 = _interopRequireDefault(_jsonOverride);

var _generator = require('./generator');

var _generator2 = _interopRequireDefault(_generator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let configuration;

exports.default = {

  /**
   * @description Configure invoiceIt with object config
   * @param config
   */
  configure: config => configuration = (0, _jsonOverride2.default)(configuration, config),

  /**
   * @description Generate invoiceIt with configuration
   * @param emitter
   * @param recipient
   * @returns {Generator}
   */
  create: (recipient, emitter) => {
    const generator = new _generator2.default(configuration);
    generator.recipient(recipient);
    generator.emitter(emitter);
    return generator;
  }

};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGFzc2VzL2luZGV4LmpzIl0sIm5hbWVzIjpbImNvbmZpZ3VyYXRpb24iLCJjb25maWd1cmUiLCJjb25maWciLCJjcmVhdGUiLCJyZWNpcGllbnQiLCJlbWl0dGVyIiwiZ2VuZXJhdG9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFJQSxhQUFKOztrQkFFZTs7QUFFYjs7OztBQUlBQyxhQUFZQyxNQUFELElBQVlGLGdCQUFnQiw0QkFBYUEsYUFBYixFQUE0QkUsTUFBNUIsQ0FOMUI7O0FBUWI7Ozs7OztBQU1BQyxVQUFRLENBQUNDLFNBQUQsRUFBWUMsT0FBWixLQUF3QjtBQUM5QixVQUFNQyxZQUFZLHdCQUFjTixhQUFkLENBQWxCO0FBQ0FNLGNBQVVGLFNBQVYsQ0FBb0JBLFNBQXBCO0FBQ0FFLGNBQVVELE9BQVYsQ0FBa0JBLE9BQWxCO0FBQ0EsV0FBT0MsU0FBUDtBQUNEOztBQW5CWSxDIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGpzb25PdmVycmlkZSBmcm9tICdqc29uLW92ZXJyaWRlJztcbmltcG9ydCBHZW5lcmF0b3IgZnJvbSAnLi9nZW5lcmF0b3InO1xuXG5sZXQgY29uZmlndXJhdGlvbjtcblxuZXhwb3J0IGRlZmF1bHQge1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gQ29uZmlndXJlIGludm9pY2VJdCB3aXRoIG9iamVjdCBjb25maWdcbiAgICogQHBhcmFtIGNvbmZpZ1xuICAgKi9cbiAgY29uZmlndXJlOiAoY29uZmlnKSA9PiBjb25maWd1cmF0aW9uID0ganNvbk92ZXJyaWRlKGNvbmZpZ3VyYXRpb24sIGNvbmZpZyksXG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBHZW5lcmF0ZSBpbnZvaWNlSXQgd2l0aCBjb25maWd1cmF0aW9uXG4gICAqIEBwYXJhbSBlbWl0dGVyXG4gICAqIEBwYXJhbSByZWNpcGllbnRcbiAgICogQHJldHVybnMge0dlbmVyYXRvcn1cbiAgICovXG4gIGNyZWF0ZTogKHJlY2lwaWVudCwgZW1pdHRlcikgPT4ge1xuICAgIGNvbnN0IGdlbmVyYXRvciA9IG5ldyBHZW5lcmF0b3IoY29uZmlndXJhdGlvbik7XG4gICAgZ2VuZXJhdG9yLnJlY2lwaWVudChyZWNpcGllbnQpO1xuICAgIGdlbmVyYXRvci5lbWl0dGVyKGVtaXR0ZXIpO1xuICAgIHJldHVybiBnZW5lcmF0b3I7XG4gIH0sXG5cbn07XG4iXX0=