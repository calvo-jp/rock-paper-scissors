import {createToaster} from '@ark-ui/react';

export const toaster = createToaster({
  placement: 'bottom-end',
  duration: 5000,
  overlap: true,
  max: 5,
});
