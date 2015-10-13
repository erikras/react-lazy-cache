import expect from 'expect';
import getParamNames from '../src/getParamNames';

function empty() {
};

function paramA(a) {
};

function paramAB(a, b) {
};

function paramABCow(a, b, cow) {
};

function paramABEF(a, b, /*c, d,*/ e, f) {
};

describe('getParamNames', () => {
  it('should return an empty array when no params', () => {
    expect(getParamNames(() => 'whatever'))
      .toExist()
      .toEqual([]);

    expect(getParamNames(empty))
      .toExist()
      .toEqual([]);
  });

  it('should catch one param', () => {
    expect(getParamNames((dog) => 'whatever'))
      .toExist()
      .toEqual(['dog']);

    expect(getParamNames(paramA))
      .toExist()
      .toEqual(['a']);
  });

  it('should catch two params', () => {
    expect(getParamNames((dog, raBBit) => 'whatever'))
      .toExist()
      .toEqual(['dog', 'raBBit']);

    expect(getParamNames(paramAB))
      .toExist()
      .toEqual(['a', 'b']);
  });

  it('should catch three params', () => {
    expect(getParamNames((dog, raBBit, Barack_Obama) => 'whatever'))
      .toExist()
      .toEqual(['dog', 'raBBit', 'Barack_Obama']);

    expect(getParamNames(paramABCow))
      .toExist()
      .toEqual(['a', 'b', 'cow']);
  });

  it('should ignore commented params', () => {
    expect(getParamNames((dog, /*cat,*/ pig) => 'whatever'))
      .toExist()
      .toEqual(['dog', 'pig']);

    expect(getParamNames(paramABEF))
      .toExist()
      .toEqual(['a', 'b', 'e', 'f']);
  });
});
