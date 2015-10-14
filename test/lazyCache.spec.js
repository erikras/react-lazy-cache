import expect from 'expect';
import lazyCache from '../src/lazyCache';

describe('lazyCache', () => {
  it('should call on get', () => {
    let calls = 0;
    const instance = lazyCache({
      props: {
        a: 4,
        b: 5
      }
    }, {
      calc: {
        params: ['a', 'b'],
        fn: (a, b) => {
          calls++;
          return a + b;
        }
      }
    });

    expect(calls).toBe(0);
    expect(instance.calc).toBe(9);
    expect(calls).toBe(1);
    expect(instance.calc).toBe(9);
    expect(calls).toBe(1);
  });

  it('should reset on prop change', () => {
    let calls = 0;
    const instance = lazyCache({
      props: {
        a: 4,
        b: 5
      }
    }, {
      calc: {
        params: ['a', 'b'],
        fn: (a, b) => {
          calls++;
          return a + b;
        }
      }
    });

    expect(calls).toBe(0);
    expect(instance.calc).toBe(9);
    expect(calls).toBe(1);
    expect(instance.calc).toBe(9);
    expect(calls).toBe(1);
    instance.componentWillReceiveProps({a: 3, b: 5});
    expect(instance.calc).toBe(9);
    expect(calls).toBe(2);
    expect(instance.calc).toBe(9);
    expect(calls).toBe(2);
  });

  it('should not reset on prop not changed', () => {
    let calls = 0;
    const instance = lazyCache({
      props: {
        a: 4,
        b: 5
      }
    }, {
      calc: {
        params: ['a', 'b'],
        fn: (a, b) => {
          calls++;
          return a + b;
        }
      }
    });

    expect(calls).toBe(0);
    expect(instance.calc).toBe(9);
    expect(calls).toBe(1);
    expect(instance.calc).toBe(9);
    expect(calls).toBe(1);
    instance.componentWillReceiveProps({a: 4, b: 5});
    expect(instance.calc).toBe(9);
    expect(calls).toBe(1);
    expect(instance.calc).toBe(9);
    expect(calls).toBe(1);
  });

  it('should not reset on unrelated prop change', () => {
    let calls = 0;
    const instance = lazyCache({
      props: {
        a: 4,
        b: 5,
        c: 6
      }
    }, {
      calc: {
        params: ['a', 'b'],
        fn: (a, b) => {
          calls++;
          return a + b;
        }
      }
    });

    expect(calls).toBe(0);
    expect(instance.calc).toBe(9);
    expect(calls).toBe(1);
    expect(instance.calc).toBe(9);
    expect(calls).toBe(1);
    instance.componentWillReceiveProps({a: 4, b: 5, c: 7});
    expect(instance.calc).toBe(9);
    expect(calls).toBe(1);
    expect(instance.calc).toBe(9);
    expect(calls).toBe(1);
  });

  it('should inject another calculated prop', () => {
    let sumCalls = 0;
    let productCalls = 0;
    const instance = lazyCache({
      props: {
        a: 4,
        b: 5,
        c: 6
      }
    }, {
      sum: {
        params: ['a', 'b'],
        fn: (a, b) => {
          sumCalls++;
          return a + b;
        }
      },
      product: {
        params: ['sum', 'c'],
        fn: (sum, c) => {
          productCalls++;
          return sum * c;
        }
      }
    });

    expect(sumCalls).toBe(0);
    expect(productCalls).toBe(0);
    expect(instance.product).toBe(54);
    expect(sumCalls).toBe(1);
    expect(productCalls).toBe(1);
    expect(instance.sum).toBe(9);
    expect(sumCalls).toBe(1);
    expect(instance.product).toBe(54);
    expect(sumCalls).toBe(1);
    expect(productCalls).toBe(1);
  });

  it('should uncache value, but not calculated prop dep when only prop changes', () => {
    let sumCalls = 0;
    let productCalls = 0;
    const props = {
      a: 4,
      b: 5,
      c: 6
    };
    const instance = lazyCache({props}, {
      sum: {
        params: ['a', 'b'],
        fn: (a, b) => {
          sumCalls++;
          return a + b;
        }
      },
      product: {
        params: ['sum', 'c'],
        fn: (sum, c) => {
          productCalls++;
          return sum * c;
        }
      }
    });

    expect(sumCalls).toBe(0);
    expect(productCalls).toBe(0);
    expect(instance.product).toBe(54);
    expect(sumCalls).toBe(1);
    expect(productCalls).toBe(1);
    expect(instance.sum).toBe(9);
    expect(sumCalls).toBe(1);
    expect(instance.product).toBe(54);
    expect(sumCalls).toBe(1);
    expect(productCalls).toBe(1);
    instance.componentWillReceiveProps({a: 4, b: 5, c: 7});
    props.c = 7;
    expect(instance.product).toBe(63);
    expect(sumCalls).toBe(1);
    expect(productCalls).toBe(2);
  });

  it('should uncache calculated prop dep when its dependent is uncached', () => {
    let sumCalls = 0;
    let productCalls = 0;
    const props = {
      a: 4,
      b: 5,
      c: 6
    };
    const instance = lazyCache({props}, {
      sum: {
        params: ['a', 'b'],
        fn: (a, b) => {
          sumCalls++;
          return a + b;
        }
      },
      product: {
        params: ['sum', 'c'],
        fn: (sum, c) => {
          productCalls++;
          return sum * c;
        }
      }
    });

    expect(sumCalls).toBe(0);
    expect(productCalls).toBe(0);
    expect(instance.product).toBe(54);
    expect(sumCalls).toBe(1);
    expect(productCalls).toBe(1);
    expect(instance.sum).toBe(9);
    expect(sumCalls).toBe(1);
    expect(instance.product).toBe(54);
    expect(sumCalls).toBe(1);
    expect(productCalls).toBe(1);
    instance.componentWillReceiveProps({a: 5, b: 5, c: 6});
    props.a = 5;
    expect(instance.product).toBe(60);
    expect(sumCalls).toBe(2);
    expect(productCalls).toBe(2);
  });
});
