import { factory } from '../../utils/factory';
import { deepMap } from '../../utils/collection';
import { sinhNumber } from '../../plain/number';
var name = 'sinh';
var dependencies = ['typed'];
export var createSinh = /* #__PURE__ */factory(name, dependencies, function (_ref) {
  var typed = _ref.typed;

  /**
   * Calculate the hyperbolic sine of a value,
   * defined as `sinh(x) = 1/2 * (exp(x) - exp(-x))`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.sinh(x)
   *
   * Examples:
   *
   *    math.sinh(0.5)       // returns number 0.5210953054937474
   *
   * See also:
   *
   *    cosh, tanh
   *
   * @param {number | BigNumber | Complex | Unit | Array | Matrix} x  Function input
   * @return {number | BigNumber | Complex | Array | Matrix} Hyperbolic sine of x
   */
  var sinh = typed(name, {
    number: sinhNumber,
    Complex: function Complex(x) {
      return x.sinh();
    },
    BigNumber: function BigNumber(x) {
      return x.sinh();
    },
    Unit: function Unit(x) {
      if (!x.hasBase(x.constructor.BASE_UNITS.ANGLE)) {
        throw new TypeError('Unit in function sinh is no angle');
      }

      return sinh(x.value);
    },
    'Array | Matrix': function ArrayMatrix(x) {
      // deep map collection, skip zeros since sinh(0) = 0
      return deepMap(x, sinh, true);
    }
  });
  return sinh;
});