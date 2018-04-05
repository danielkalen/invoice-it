'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
class Common {
  /**
   * @description Hydrate current instance with obj attributes
   * @param obj
   * @param attributes
   * @todo optimize it
   */
  hydrate(obj, attributes) {
    if (!obj) return;
    // eslint-disable-next-line no-restricted-syntax
    for (const item of attributes) {
      this[item] = obj[item] ? obj[item] : '';
    }
  }

  /**
   * @description Return number with padding
   * @example if id = 10, return 0010
   * @param num
   * @param size
   * @return {string}
   */
  pad(num, size = 3) {
    let output = num.toString();
    while (output.length < size) output = `0${output}`;
    return output;
  }

  /**
   * @description Check if is a number
   * @param n
   * @returns {boolean}
   */
  isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  /**
   * @description Round float with x decimals
   * @param num
   * @param decimals, default 2 decimals
   * @returns {number}
   */
  round(num, decimals = 2) {
    if (!`${num}`.includes('e')) {
      return +`${Math.round(`${num}e+${decimals}`)}e-${decimals}`;
    }
    const arr = `${num}`.split('e');
    let sig = '';
    if (+arr[1] + decimals > 0) sig = '+';
    return +`${Math.round(`${+arr[0]}e${sig}${+arr[1] + decimals}`)}e-${decimals}`;
  }

  /**
   * @description Format number to return number with two decimals
   * @param num
   * @return {string}
   */
  formatOutputNumber(num) {
    const number = num.toString();
    if (number.includes('.')) {
      const split = number.split('.');
      if (split[1].length === 1) return `${split[0]}.${split[1]}0`;else if (split[1].length === 2) return number;
      return `${split[0]}.${split[1][0]}${split[1][1]}`;
    }
    return `${number}.00`;
  }
}
exports.default = Common;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGFzc2VzL2NvbW1vbi5qcyJdLCJuYW1lcyI6WyJDb21tb24iLCJoeWRyYXRlIiwib2JqIiwiYXR0cmlidXRlcyIsIml0ZW0iLCJwYWQiLCJudW0iLCJzaXplIiwib3V0cHV0IiwidG9TdHJpbmciLCJsZW5ndGgiLCJpc051bWVyaWMiLCJuIiwiaXNOYU4iLCJwYXJzZUZsb2F0IiwiaXNGaW5pdGUiLCJyb3VuZCIsImRlY2ltYWxzIiwiaW5jbHVkZXMiLCJNYXRoIiwiYXJyIiwic3BsaXQiLCJzaWciLCJmb3JtYXRPdXRwdXROdW1iZXIiLCJudW1iZXIiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQWUsTUFBTUEsTUFBTixDQUFhO0FBQzFCOzs7Ozs7QUFNQUMsVUFBUUMsR0FBUixFQUFhQyxVQUFiLEVBQXlCO0FBQ3ZCLFFBQUksQ0FBQ0QsR0FBTCxFQUFVO0FBQ1Y7QUFDQSxTQUFLLE1BQU1FLElBQVgsSUFBbUJELFVBQW5CLEVBQStCO0FBQzdCLFdBQUtDLElBQUwsSUFBY0YsSUFBSUUsSUFBSixDQUFELEdBQWNGLElBQUlFLElBQUosQ0FBZCxHQUEwQixFQUF2QztBQUNEO0FBQ0Y7O0FBRUQ7Ozs7Ozs7QUFPQUMsTUFBSUMsR0FBSixFQUFTQyxPQUFPLENBQWhCLEVBQW1CO0FBQ2pCLFFBQUlDLFNBQVNGLElBQUlHLFFBQUosRUFBYjtBQUNBLFdBQU9ELE9BQU9FLE1BQVAsR0FBZ0JILElBQXZCLEVBQTZCQyxTQUFVLElBQUdBLE1BQU8sRUFBcEI7QUFDN0IsV0FBT0EsTUFBUDtBQUNEOztBQUVEOzs7OztBQUtBRyxZQUFVQyxDQUFWLEVBQWE7QUFDWCxXQUFPLENBQUNDLE1BQU1DLFdBQVdGLENBQVgsQ0FBTixDQUFELElBQXlCRyxTQUFTSCxDQUFULENBQWhDO0FBQ0Q7O0FBRUQ7Ozs7OztBQU1BSSxRQUFNVixHQUFOLEVBQVdXLFdBQVcsQ0FBdEIsRUFBeUI7QUFDdkIsUUFBSSxDQUFHLEdBQUVYLEdBQUksRUFBUixDQUFXWSxRQUFYLENBQW9CLEdBQXBCLENBQUwsRUFBK0I7QUFDN0IsYUFBTyxDQUFHLEdBQUVDLEtBQUtILEtBQUwsQ0FBWSxHQUFFVixHQUFJLEtBQUlXLFFBQVMsRUFBL0IsQ0FBa0MsS0FBSUEsUUFBUyxFQUEzRDtBQUNEO0FBQ0QsVUFBTUcsTUFBUSxHQUFFZCxHQUFJLEVBQVIsQ0FBV2UsS0FBWCxDQUFpQixHQUFqQixDQUFaO0FBQ0EsUUFBSUMsTUFBTSxFQUFWO0FBQ0EsUUFBSSxDQUFDRixJQUFJLENBQUosQ0FBRCxHQUFVSCxRQUFWLEdBQXFCLENBQXpCLEVBQTRCSyxNQUFNLEdBQU47QUFDNUIsV0FBTyxDQUFHLEdBQUVILEtBQUtILEtBQUwsQ0FBWSxHQUFFLENBQUNJLElBQUksQ0FBSixDQUFPLElBQUdFLEdBQUksR0FBRSxDQUFDRixJQUFJLENBQUosQ0FBRCxHQUFVSCxRQUFTLEVBQWxELENBQXFELEtBQUlBLFFBQVMsRUFBOUU7QUFDRDs7QUFFRDs7Ozs7QUFLQU0scUJBQW1CakIsR0FBbkIsRUFBd0I7QUFDdEIsVUFBTWtCLFNBQVNsQixJQUFJRyxRQUFKLEVBQWY7QUFDQSxRQUFJZSxPQUFPTixRQUFQLENBQWdCLEdBQWhCLENBQUosRUFBMEI7QUFDeEIsWUFBTUcsUUFBUUcsT0FBT0gsS0FBUCxDQUFhLEdBQWIsQ0FBZDtBQUNBLFVBQUlBLE1BQU0sQ0FBTixFQUFTWCxNQUFULEtBQW9CLENBQXhCLEVBQTJCLE9BQVEsR0FBRVcsTUFBTSxDQUFOLENBQVMsSUFBR0EsTUFBTSxDQUFOLENBQVMsR0FBL0IsQ0FBM0IsS0FDSyxJQUFJQSxNQUFNLENBQU4sRUFBU1gsTUFBVCxLQUFvQixDQUF4QixFQUEyQixPQUFPYyxNQUFQO0FBQ2hDLGFBQVEsR0FBRUgsTUFBTSxDQUFOLENBQVMsSUFBR0EsTUFBTSxDQUFOLEVBQVMsQ0FBVCxDQUFZLEdBQUVBLE1BQU0sQ0FBTixFQUFTLENBQVQsQ0FBWSxFQUFoRDtBQUNEO0FBQ0QsV0FBUSxHQUFFRyxNQUFPLEtBQWpCO0FBQ0Q7QUFuRXlCO2tCQUFQeEIsTSIsImZpbGUiOiJjb21tb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBDb21tb24ge1xuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIEh5ZHJhdGUgY3VycmVudCBpbnN0YW5jZSB3aXRoIG9iaiBhdHRyaWJ1dGVzXG4gICAqIEBwYXJhbSBvYmpcbiAgICogQHBhcmFtIGF0dHJpYnV0ZXNcbiAgICogQHRvZG8gb3B0aW1pemUgaXRcbiAgICovXG4gIGh5ZHJhdGUob2JqLCBhdHRyaWJ1dGVzKSB7XG4gICAgaWYgKCFvYmopIHJldHVybjtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcmVzdHJpY3RlZC1zeW50YXhcbiAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgYXR0cmlidXRlcykge1xuICAgICAgdGhpc1tpdGVtXSA9IChvYmpbaXRlbV0pID8gb2JqW2l0ZW1dIDogJyc7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBSZXR1cm4gbnVtYmVyIHdpdGggcGFkZGluZ1xuICAgKiBAZXhhbXBsZSBpZiBpZCA9IDEwLCByZXR1cm4gMDAxMFxuICAgKiBAcGFyYW0gbnVtXG4gICAqIEBwYXJhbSBzaXplXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIHBhZChudW0sIHNpemUgPSAzKSB7XG4gICAgbGV0IG91dHB1dCA9IG51bS50b1N0cmluZygpO1xuICAgIHdoaWxlIChvdXRwdXQubGVuZ3RoIDwgc2l6ZSkgb3V0cHV0ID0gYDAke291dHB1dH1gO1xuICAgIHJldHVybiBvdXRwdXQ7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIENoZWNrIGlmIGlzIGEgbnVtYmVyXG4gICAqIEBwYXJhbSBuXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgaXNOdW1lcmljKG4pIHtcbiAgICByZXR1cm4gIWlzTmFOKHBhcnNlRmxvYXQobikpICYmIGlzRmluaXRlKG4pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBSb3VuZCBmbG9hdCB3aXRoIHggZGVjaW1hbHNcbiAgICogQHBhcmFtIG51bVxuICAgKiBAcGFyYW0gZGVjaW1hbHMsIGRlZmF1bHQgMiBkZWNpbWFsc1xuICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgKi9cbiAgcm91bmQobnVtLCBkZWNpbWFscyA9IDIpIHtcbiAgICBpZiAoIShgJHtudW19YCkuaW5jbHVkZXMoJ2UnKSkge1xuICAgICAgcmV0dXJuICsoYCR7TWF0aC5yb3VuZChgJHtudW19ZSske2RlY2ltYWxzfWApfWUtJHtkZWNpbWFsc31gKTtcbiAgICB9XG4gICAgY29uc3QgYXJyID0gKGAke251bX1gKS5zcGxpdCgnZScpO1xuICAgIGxldCBzaWcgPSAnJztcbiAgICBpZiAoK2FyclsxXSArIGRlY2ltYWxzID4gMCkgc2lnID0gJysnO1xuICAgIHJldHVybiArKGAke01hdGgucm91bmQoYCR7K2FyclswXX1lJHtzaWd9JHsrYXJyWzFdICsgZGVjaW1hbHN9YCl9ZS0ke2RlY2ltYWxzfWApO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBGb3JtYXQgbnVtYmVyIHRvIHJldHVybiBudW1iZXIgd2l0aCB0d28gZGVjaW1hbHNcbiAgICogQHBhcmFtIG51bVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBmb3JtYXRPdXRwdXROdW1iZXIobnVtKSB7XG4gICAgY29uc3QgbnVtYmVyID0gbnVtLnRvU3RyaW5nKCk7XG4gICAgaWYgKG51bWJlci5pbmNsdWRlcygnLicpKSB7XG4gICAgICBjb25zdCBzcGxpdCA9IG51bWJlci5zcGxpdCgnLicpO1xuICAgICAgaWYgKHNwbGl0WzFdLmxlbmd0aCA9PT0gMSkgcmV0dXJuIGAke3NwbGl0WzBdfS4ke3NwbGl0WzFdfTBgO1xuICAgICAgZWxzZSBpZiAoc3BsaXRbMV0ubGVuZ3RoID09PSAyKSByZXR1cm4gbnVtYmVyO1xuICAgICAgcmV0dXJuIGAke3NwbGl0WzBdfS4ke3NwbGl0WzFdWzBdfSR7c3BsaXRbMV1bMV19YDtcbiAgICB9XG4gICAgcmV0dXJuIGAke251bWJlcn0uMDBgO1xuICB9XG59XG4iXX0=