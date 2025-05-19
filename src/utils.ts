import {createToaster} from '@ark-ui/react';

export function invariant(condition: unknown): asserts condition {
  if (!condition) {
    const error = new Error();
    error.name = 'InvariantError';
    error.message = 'Invariant failed';
    throw error;
  }
}

export const toaster = createToaster({
  placement: 'bottom-end',
  overlap: true,
  max: 5,
});
