const stripComments = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/mg;
const argNames = /([^\s,]+)/g;

export default function getParamNames(fn) {
  const fnStr = fn.toString().replace(stripComments, '');
  const result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(argNames);
  return result || [];
}
