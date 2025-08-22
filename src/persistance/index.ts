import { compress, decompress } from 'lz-string';
import { Persis } from './consts';

class Persistance {
  private genExpireTime() {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() + Persis.ExpireDays);
    d.setUTCHours(Persis.ExpireHour);
    return d.getTime();
  }

  private format(value: unknown, expire: number) {
    const valueType = value === null ? 'null' : typeof value;
    if (valueType === 'function') {
      throw new TypeError('Cannot stringify private');
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
    return `${expire},${valueType},${compress(s)}`;
  }

  private deformat(str: string) {
    const [expireStr, valueType] = str.split(',', 2);
    console.log(expireStr, valueType);
    const expire = parseInt(expireStr, 10);
    if (isNaN(expire)) {
      throw new Error('Invalid expire time format');
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
  save(key: string, obj: any, expire?: number) {
    const value = this.format(obj, expire ?? this.genExpireTime());
    localStorage.setItem(Persis.Prefix + key, value);
  }

  /**
   * Load a value from localStorage with a key.
   * - when the key does not exist or the value is expired, returns null.
   */
  load<T>(key: string): T | null {
    const pkey = Persis.Prefix + key;

    const rawValue = localStorage.getItem(pkey);
    if (rawValue === null) {
      console.log(`Load '${key}' from remote`);
      return null;
    }

    try {
      const { expire, value } = this.deformat(rawValue);
      if (expire < Date.now()) {
        return null;
      }
      console.log(`Load '${key}' from localStorage`);
      return value as T;
    } catch (e) {
      console.error(`Error loading key, will return null. "${key}":`, e);
      return null;
    }
  }
}

const persis = new Persistance();
export default persis;
