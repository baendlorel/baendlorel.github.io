import { compress, decompress } from 'lz-string';
import { Persis } from './consts';

function genExpireTime() {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + Persis.ExpireDays);
  d.setUTCHours(Persis.ExpireHour);
  return d.getTime();
}

/**
 * [WARN] Must use object can be stringified
 * @param key will prepend a prefix before it
 * @param obj can be object and primitive
 * @param expire if omitted, will use default expire time
 */
export function save(key: string, obj: any, expire?: number) {
  const value = typeof obj === 'object' && obj !== null ? JSON.stringify(obj) : String(obj);
  const s = compress(value);
  const e = expire ?? genExpireTime();
  localStorage.setItem(Persis.Prefix + key, s);
  localStorage.setItem(Persis.ExpirePrefix + key, e.toString());
}

/**
 * Load a value from localStorage with a key.
 * - when the key does not exist or the value is expired, returns null.
 */
export function load<T extends unknown>(key: string): T | null {
  const pkey = Persis.Prefix + key;
  const expireKey = Persis.ExpirePrefix + key;

  const value = localStorage.getItem(pkey);
  if (value === null) {
    console.log(`Load '${key}' from remote`);
    return null;
  }

  const e = parseInt(localStorage.getItem(expireKey), 10);
  if (e < Date.now()) {
    localStorage.removeItem(pkey);
    console.log(`Load '${key}' from remote`);
    return null;
  }

  try {
    const v = JSON.parse(decompress(value));
    console.log(`Load '${key}' from localStorage`);
    return v;
  } catch (e) {
    console.error(`Error loading key "${key}":`, e);
    return null;
  }
}
