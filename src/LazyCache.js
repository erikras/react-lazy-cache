import getParamNames from './getParamNames';
import intersects from './intersects';
import deepEqual from 'deep-equal';

export default class LazyCache {
  constructor(component, calculators) {
    this.component = component;
    this.allProps = [];
    this.cache = Object.keys(calculators).reduce((accumulator, key) => {
      const calculator = calculators[key];
      const paramNames = getParamNames(calculator);
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
          calculate: calculator
        }
      };
    }, {});
  }

  get(key) {
    const {component} = this;
    const {value, calculate, props} = this.cache[key];
    if (value !== undefined) {
      return value;
    }
    const params = props.map(prop => component.props[prop]);
    const result = calculate(...params);
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
