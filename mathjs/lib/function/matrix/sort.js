"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSort = void 0;

var _array = require("../../utils/array");

var _factory = require("../../utils/factory");

var name = 'sort';
var dependencies = ['typed', 'matrix', 'compare', 'compareNatural'];
var createSort = /* #__PURE__ */(0, _factory.factory)(name, dependencies, function (_ref) {
  var typed = _ref.typed,
      matrix = _ref.matrix,
      compare = _ref.compare,
      compareNatural = _ref.compareNatural;
  var compareAsc = compare;

  var compareDesc = function compareDesc(a, b) {
    return -compare(a, b);
  };
  /**
   * Sort the items in a matrix.
   *
   * Syntax:
   *
   *    math.sort(x)
   *    math.sort(x, compare)
   *
   * Examples:
   *
   *    math.sort([5, 10, 1]) // returns [1, 5, 10]
   *    math.sort(['C', 'B', 'A', 'D'], math.compareNatural)
   *    // returns ['A', 'B', 'C', 'D']
   *
   *    function sortByLength (a, b) {
   *      return a.length - b.length
   *    }
   *    math.sort(['Langdon', 'Tom', 'Sara'], sortByLength)
   *    // returns ['Tom', 'Sara', 'Langdon']
   *
   * See also:
   *
   *    filter, forEach, map, compare, compareNatural
   *
   * @param {Matrix | Array} x    A one dimensional matrix or array to sort
   * @param {Function | 'asc' | 'desc' | 'natural'} [compare='asc']
   *        An optional _comparator function or name. The function is called as
   *        `compare(a, b)`, and must return 1 when a > b, -1 when a < b,
   *        and 0 when a == b.
   * @return {Matrix | Array} Returns the sorted matrix.
   */


  return typed(name, {
    Array: function Array(x) {
      _arrayIsVector(x);

      return x.sort(compareAsc);
    },
    Matrix: function Matrix(x) {
      _matrixIsVector(x);

      return matrix(x.toArray().sort(compareAsc), x.storage());
    },
    'Array, function': function ArrayFunction(x, _comparator) {
      _arrayIsVector(x);

      return x.sort(_comparator);
    },
    'Matrix, function': function MatrixFunction(x, _comparator) {
      _matrixIsVector(x);

      return matrix(x.toArray().sort(_comparator), x.storage());
    },
    'Array, string': function ArrayString(x, order) {
      _arrayIsVector(x);

      return x.sort(_comparator(order));
    },
    'Matrix, string': function MatrixString(x, order) {
      _matrixIsVector(x);

      return matrix(x.toArray().sort(_comparator(order)), x.storage());
    }
  });
  /**
   * Get the comparator for given order ('asc', 'desc', 'natural')
   * @param {'asc' | 'desc' | 'natural'} order
   * @return {Function} Returns a _comparator function
   */

  function _comparator(order) {
    if (order === 'asc') {
      return compareAsc;
    } else if (order === 'desc') {
      return compareDesc;
    } else if (order === 'natural') {
      return compareNatural;
    } else {
      throw new Error('String "asc", "desc", or "natural" expected');
    }
  }
  /**
   * Validate whether an array is one dimensional
   * Throws an error when this is not the case
   * @param {Array} array
   * @private
   */


  function _arrayIsVector(array) {
    if ((0, _array.arraySize)(array).length !== 1) {
      throw new Error('One dimensional array expected');
    }
  }
  /**
   * Validate whether a matrix is one dimensional
   * Throws an error when this is not the case
   * @param {Matrix} matrix
   * @private
   */


  function _matrixIsVector(matrix) {
    if (matrix.size().length !== 1) {
      throw new Error('One dimensional matrix expected');
    }
  }
});
exports.createSort = createSort;