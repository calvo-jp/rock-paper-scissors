export function invariant(condition: unknown): asserts condition {
  if (!condition) {
    const error = new Error();
    error.name = 'InvariantError';
    error.message = 'Invariant failed';
    throw error;
  }
}
