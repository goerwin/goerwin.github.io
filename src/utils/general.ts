export function tryUnknownFn(
  ctx: unknown,
  fnName: string,
  args: unknown[] = [],
) {
  try {
    if (typeof ctx !== 'object' || ctx === null) return false;
    if (!(fnName in ctx)) return false;

    // todo: this exists , only that TS does not infer it, because fnName can be mutated!
    // biome-ignore lint/suspicious/noExplicitAny: dynamic property access
    const possibleFn = (ctx as any)[fnName] as unknown;
    if (typeof possibleFn === 'function') return possibleFn(...args);
  } catch (_err) {
    console.error(`Function ${fnName} could not be run, it does not exist`);
  }
}
