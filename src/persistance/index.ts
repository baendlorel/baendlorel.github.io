import { compress, decompress } from 'lz-string';
import { Persis } from './consts';

function genExpireTime() {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + Persis.ExpireDays);
  d.setUTCHours(Persis.ExpireHour);
  return d.getTime();
}

function format(expire: number, value: unknown) {
  const valueType = value === null ? 'null' : typeof value;
  if (valueType === 'function') {
    throw new TypeError('Cannot stringify function');
  }

  let s: string;
  switch (valueType) {
    case 'object':
      s = JSON.stringify(value);
      break;
    case 'boolean':
    case 'string':
    case 'number':
    case 'bigint':
    case 'null':
    case 'undefined':
      // For primitive types, we can directly return the string representation
      s = String(value);
      break;
    case 'symbol':
      throw new TypeError('Cannot stringify symbol');
  }
  return `${expire},${valueType},${s}`;
}

function deformat(str: string) {
  const [expireStr, valueType] = str.split(',', 2);
  const expire = parseInt(expireStr, 10);
  if (isNaN(expire)) {
    return null;
  }
  if (valueType === 'null') {
    return null;
  }

  const valueStr = decompress(str.slice(expireStr.length + valueType.length + 2));

  let o: unknown;
  switch (valueType) {
    case 'object':
      o = JSON.parse(valueStr);
      break;
    case 'boolean':
      o = valueStr === 'true';
      break;
    case 'string':
      o = valueStr;
      break;
    case 'number':
      o = Number(valueStr);
      break;
    case 'bigint':
      o = BigInt(valueStr);
      break;
    case 'null':
      o = null;
      break;
    case 'undefined':
      o = undefined;
      break;
    case 'symbol':
    default:
      throw new TypeError('Cannot parse symbol or other types');
  }

  return { expire, valueType, value: o };
}

/**
 * [WARN] Must use object can be stringified
 * @param key will prepend a prefix before it
 * @param obj can be object and primitive
 * @param expire if omitted, will use default expire time
 */
export function save(key: string, obj: any, expire?: number) {
  const value = format(expire ?? genExpireTime(), obj);
  const s = compress(value);
  localStorage.setItem(Persis.Prefix + key, s);
}

/**
 * Load a value from localStorage with a key.
 * - when the key does not exist or the value is expired, returns null.
 */
export function load<T extends unknown>(key: string): T | null {
  const pkey = Persis.Prefix + key;

  const rawValue = localStorage.getItem(pkey);
  if (rawValue === null) {
    console.log(`Load '${key}' from remote`);
    return null;
  }

  try {
    const { expire, value } = deformat(rawValue);
    if (expire < Date.now()) {
      throw new Error(`Value expired`);
    }
    console.log(`Load '${key}' from localStorage`);
    return value as T;
  } catch (e) {
    console.error(`Error loading key "${key}":`, e);
    return null;
  }
}
