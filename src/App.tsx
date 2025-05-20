import {Toast, Toaster} from '@ark-ui/react';
import {XIcon} from 'lucide-react';
import {useEffect, useRef} from 'react';
import {twMerge} from 'tailwind-merge';
import useSound from 'use-sound';
import emojiMonocle from './assets/emoji-monocle.gif';
import emojiTrophy from './assets/emoji-trophy.gif';
import notificationAudio from './assets/notification.wav';
import {RockPaperScissors} from './RockPaperScissors';
import {ThemeContext} from './ThemeContext';
import {toaster} from './toaster';
import {useTheme} from './useTheme';

export function App() {
  const theme = useTheme();
  const toasts = useRef<string[]>([]);
  const [playNotificationSound] = useSound(notificationAudio, {
    volume: 0.75,
  });

  useEffect(() => {
    return toaster.subscribe((args) => {
      if (args.dismiss) {
        toasts.current = toasts.current.filter((id) => id !== args.id);
        return;
      }

      if (!toasts.current.includes(args.id)) {
        playNotificationSound({forceSoundEnabled: true});
        toasts.current = [...toasts.current, args.id];
        return;
      }
    });
  }, [playNotificationSound]);

  return (
    <>
      <ThemeContext value={theme}>
        <RockPaperScissors />
      </ThemeContext>

      <Toaster toaster={toaster}>
        {(toast) => (
          <Toast.Root
            key={toast.id}
            className={twMerge(
              'z-[var(--z-index)]',
              'h-[var(--height)]',
              'scale-[var(--scale)]',
              'opacity-[var(--opacity)]',
              'transition-all',
              'duration-300',
              '[translate:var(--x)_var(--y)_0]',

              'flex',
              'items-start',
              'gap-4',
              'min-w-[32rem]',
              'rounded-xl',
              'py-2.5',
              'px-3.5',
              'bg-white',
              'border',
              'border-neutral-100',
              'dark:border-0',
              'dark:bg-teal-900',
            )}
          >
            <img
              src={toast.type === 'success' ? emojiTrophy : emojiMonocle}
              alt=""
              className="w-10 h-auto self-center"
            />

            <div className="grow">
              <Toast.Title className="font-semibold">{toast.title}</Toast.Title>
              <Toast.Description className="text-sm text-neutral-600 dark:text-white/75">
                {toast.description}
              </Toast.Description>
            </div>

            <Toast.CloseTrigger className="text-neutral-500 hover:text-neutral-600 dark:text-white/50 dark:hover:text-white/75">
              <XIcon className="size-5" />
            </Toast.CloseTrigger>
          </Toast.Root>
        )}
      </Toaster>
    </>
  );
}
