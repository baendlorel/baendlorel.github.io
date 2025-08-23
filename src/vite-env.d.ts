/// <reference types="svelte" />
/// <reference types="vite/client" />

type IsSameType<T, U> = (<G>() => G extends T ? 1 : 2) extends <G>() => G extends U ? 1 : 2
  ? true
  : false;

type Merge<A, B> = Omit<A, keyof B> & B;

type SimpleArrayDelimiter = '||';

declare const __IS_DEV__: boolean;

type Language = 'en' | 'zh';
type Theme = 'dark' | 'light';
