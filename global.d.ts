declare module 'react' {
  export function useState<T = any>(initial?: T | (() => T)) : [T, (v: T) => void];
  export function useEffect(...args: any[]): any;
  export function useRef<T = any>(initial?: T): { current: T };
  export const Fragment: any;
  const _default: any;
  export default _default;
}

declare module 'react/jsx-runtime' {
  const jsx: any;
  export = jsx;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
