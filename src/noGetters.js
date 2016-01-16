import deepEqual from 'deep-equal';

function intersects(array1, array2) {
  return !!(array1 && array2 && array1.some(item => ~array2.indexOf(item)));
}

export default class LazyCache {
  constructor(component, calculators) {
    this.component = component;
    this.allProps = [];
    this.cache = Object.keys(calculators).reduce((accumulator, key) => {
      const calculator = calculators[key];
      const fn = calculator.fn;
      const paramNames = calculator.params;
      paramNames.forEach(param => {
        if (!~this.allProps.indexOf(param)) {
          this.allProps.push(param);
        }
      });
      return {
        ...accumulator,
        [key]: {
          value: undefined,
          props: paramNames,
          fn: fn
        }
      };
    }, {});
  }

  get(key) {
    const {component} = this;
    const {value, fn, props} = this.cache[key];
    if (value !== undefined) {
      return value;
    }
    const params = props.map(prop => component.props[prop]);
    const result = fn(...params);
    this.cache[key].value = result;
    return result;
  }

  componentWillReceiveProps(nextProps) {
    const {component} = this;
    const diffProps = [];
    this.allProps.forEach(prop => {
      if (!deepEqual(component.props[prop], nextProps[prop])) {
        diffProps.push(prop);
      }
    });
    if (diffProps.length) {
      Object.keys(this.cache).forEach(key => {
        if (intersects(diffProps, this.cache[key].props)) {
          delete this.cache[key].value; // uncache value
        }
      });
    }
  }
}
