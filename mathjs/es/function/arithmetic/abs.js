import { factory } from '../../utils/factory';
import { deepMap } from '../../utils/collection';
import { absNumber } from '../../plain/number';
var name = 'abs';
var dependencies = ['typed'];
export var createAbs = /* #__PURE__ */factory(name, dependencies, function (_ref) {
  var typed = _ref.typed;

  /**
   * Calculate the absolute value of a number. For matrices, the function is
   * evaluated element wise.
   *
   * Syntax:
   *
   *    math.abs(x)
   *
   * Examples:
   *
   *    math.abs(3.5)                // returns number 3.5
   *    math.abs(-4.2)               // returns number 4.2
   *
   *    math.abs([3, -5, -1, 0, 2])  // returns Array [3, 5, 1, 0, 2]
   *
   * See also:
   *
   *    sign
   *
   * @param  {number | BigNumber | Fraction | Complex | Array | Matrix | Unit} x
   *            A number or matrix for which to get the absolute value
   * @return {number | BigNumber | Fraction | Complex | Array | Matrix | Unit}
   *            Absolute value of `x`
   */
  var abs = typed(name, {
    number: absNumber,
    Complex: function Complex(x) {
      return x.abs();
    },
    BigNumber: function BigNumber(x) {
      return x.abs();
    },
    Fraction: function Fraction(x) {
      return x.abs();
    },
    'Array | Matrix': function ArrayMatrix(x) {
      // deep map collection, skip zeros since abs(0) = 0
      return deepMap(x, abs, true);
    },
    Unit: function Unit(x) {
      return x.abs();
    }
  });
  return abs;
});