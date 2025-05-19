import {Dialog, Field, Menu, Portal, Tooltip} from '@ark-ui/react';
import {zodResolver} from '@hookform/resolvers/zod';
import {
  CopyrightIcon,
  Gamepad2Icon,
  LaptopMinimalIcon,
  MedalIcon,
  PowerIcon,
  ScissorsLineDashed,
  Settings,
  TrendingDownIcon,
  TrendingUpDownIcon,
  TrendingUpIcon,
  UserIcon,
  XIcon,
} from 'lucide-react';
import {createContext, useContext} from 'react';
import CountUp from 'react-countup';
import {useForm} from 'react-hook-form';
import Avatar from 'react-nice-avatar';
import {twMerge} from 'tailwind-merge';
import {z} from 'zod';
import {PaperIcon} from './PaperIcon';
import {RockIcon} from './RockIcon';
import {ScissorsIcon} from './ScissorsIcon';
import {
  RockPaperScissorsContext,
  useRockPaperScissors,
  useRockPaperScissorsContext,
  type LeaderboardEntry,
  type Score,
} from './useRockPaperScissors';
import {invariant} from './utils';

export function RockPaperScissors() {
  const rockPaperScissors = useRockPaperScissors();

  return (
    <RockPaperScissorsContext value={rockPaperScissors}>
      <div className="flex flex-col min-h-dvh">
        <Navbar />

        <main className="flex flex-col p-16 max-w-[800px] mx-auto items-center justify-center grow">
          <h1 className="text-5xl font-bold font-heading">Rock Paper Scissors</h1>
          <nav className="mt-32 grid grid-cols-3 gap-10">
            <button
              type="button"
              className="w-full p-4 bg-teal-800/15 rounded-full hover:scale-110 transition-transform duration-200"
              aria-label="Rock"
            >
              <RockIcon className="w-full aspect-square text-teal-100" />
            </button>
            <button
              type="button"
              className="w-full p-4 bg-teal-800/15 rounded-full hover:scale-110 transition-transform duration-200"
              aria-label="Paper"
            >
              <PaperIcon className="w-full aspect-square text-teal-100" />
            </button>
            <button
              type="button"
              className="w-full p-4 bg-teal-800/15 rounded-full hover:scale-110 transition-transform duration-200"
              aria-label="Scissors"
            >
              <ScissorsIcon className="w-full aspect-square text-teal-100" />
            </button>
          </nav>
          <div className="mt-28 w-full">
            <PlayGame />
            <GameStatus />
          </div>
        </main>

        <Footer />
      </div>
    </RockPaperScissorsContext>
  );
}

function GameStatus() {
  const rockPaperScissors = useRockPaperScissorsContext();

  if (rockPaperScissors.details.status === 'WAITING') return;

  return (
    <div className="flex justify-between items-center px-2">
      <div className="flex gap-3 items-center">
        <Avatar {...rockPaperScissors.details.player.avatar} className="size-8" />
        <GameScore score={rockPaperScissors.details.score} />
      </div>

      <div className="font-mono flex items-center gap-1">
        <span className="text-sm leading-none text-white/75">Round</span>
        <CountUp
          start={1}
          end={rockPaperScissors.details.round}
          className="font-bold text-2xl leading-none"
        />
      </div>

      <div className="flex gap-3 items-center">
        <div className="size-8 bg-teal-800/30 rounded-full flex items-center justify-center">
          <LaptopMinimalIcon className="size-5" />
        </div>
        <GameScore
          score={{
            wins: rockPaperScissors.details.score.losses,
            losses: rockPaperScissors.details.score.wins,
            ties: rockPaperScissors.details.score.ties,
          }}
        />
      </div>
    </div>
  );
}

function GameScore({score}: {score: Score}) {
  return (
    <div className="flex font-mono items-center gap-4">
      <div className="text-emerald-400 flex items-center gap-2">
        <TrendingUpIcon className="size-4" />
        <CountUp start={0} end={score.wins} />
      </div>
      <div className="text-rose-400 flex items-center gap-2">
        <TrendingDownIcon className="size-4" />
        <CountUp start={0} end={score.losses} />
      </div>
      <div className="text-amber-400 flex items-center gap-2">
        <TrendingUpDownIcon className="size-4" />
        <CountUp start={0} end={score.ties} />
      </div>
    </div>
  );
}

const PlayerDefinition = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(25, 'Name must be at most 25 characters'),
});

function PlayGame() {
  const rockPaperScissors = useRockPaperScissorsContext();

  const form = useForm({
    resolver: zodResolver(PlayerDefinition),
    defaultValues: {
      name: '',
    },
  });

  return (
    <Dialog.Root
      onOpenChange={(details) => {
        if (details.open) {
          form.setFocus('name');
        } else {
          form.reset();
        }
      }}
      lazyMount
      unmountOnExit
    >
      <Dialog.Trigger asChild>
        <button
          type="button"
          className={twMerge(
            'w-fit mx-auto px-6 py-3 text-xl bg-teal-800/15 flex items-center justify-center gap-2 rounded-full font-heading font-bold ui-not-open:animate-bounce',
            rockPaperScissors.details.status !== 'WAITING' && 'hidden',
          )}
        >
          <Gamepad2Icon className="size-7" />
          Play Now!
        </button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black/25 backdrop-blur-sm ui-open:animate-backdrop-in ui-closed:animate-backdrop-out" />
        <Dialog.Positioner className="fixed inset-0 flex items-center justify-center">
          <Dialog.Content className="w-[32rem] p-12 bg-teal-900 rounded-2xl ui-open:animate-dialog-in ui-closed:animate-dialog-out relative shadow-lg">
            <Dialog.CloseTrigger className="absolute -top-10 -right-10 bg-white/10 p-2 rounded-full hover:">
              <XIcon className="size-6" />
            </Dialog.CloseTrigger>

            <ScissorsLineDashed className="size-10 text-white/75" />

            <Dialog.Context>
              {(api) => (
                <form
                  className="mt-10"
                  onSubmit={form.handleSubmit(({name}) => {
                    rockPaperScissors.play(name);
                    api.setOpen(false);
                  })}
                >
                  <Field.Root invalid={!!form.formState.errors.name}>
                    <Field.Label className="text-lg mb-2 block font-heading">Name</Field.Label>
                    <Field.Input
                      className="block w-full h-14 px-5 font-heading text-lg border border-teal-700 outline-none rounded-full bg-teal-800/50"
                      placeholder="eg. Mario"
                      {...form.register('name')}
                    />
                    <Field.ErrorText className="text-red-400 text-sm">
                      {form.formState.errors.name?.message}
                    </Field.ErrorText>
                  </Field.Root>
                  <button className="font-heading block w-full h-14 mt-8 bg-white rounded-full text-teal-800 font-bold text-lg">
                    Play Now
                  </button>
                </form>
              )}
            </Dialog.Context>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

function Navbar() {
  const rockPaperScissors = useRockPaperScissorsContext();

  return (
    <header className="flex py-4 px-5 justify-between items-center">
      <ScissorsLineDashed className="size-6 text-white/60" />
      <div className="flex items-center gap-3">
        <div className="flex shrink-0 items-center gap-2">
          {rockPaperScissors.details.status === 'WAITING' ? (
            <div className="size-6 bg-teal-800/30 rounded-full flex items-center justify-center">
              <UserIcon className="size-4" />
            </div>
          ) : (
            <Avatar
              {...rockPaperScissors.details.player.avatar}
              className="size-6 bg-teal-800/30 rounded-full"
            />
          )}

          <span>
            Hi,{' '}
            {rockPaperScissors.details.status === 'WAITING'
              ? 'Guest'
              : rockPaperScissors.details.player.name}
            !
          </span>
        </div>

        <div className="flex gap-2">
          <UserMenu />
          <Leaderboard />
          <GameInfo />
        </div>
      </div>
    </header>
  );
}

function UserMenu() {
  const rockPaperScissors = useRockPaperScissorsContext();

  return (
    <Menu.Root lazyMount unmountOnExit positioning={{placement: 'bottom'}}>
      <Menu.Trigger
        disabled={rockPaperScissors.details.status === 'WAITING'}
        className="disabled:cursor-not-allowed disabled:opacity-75"
      >
        <Settings className="size-5" />
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content className="bg-teal-900 min-w-40 rounded-lg shadow-lg outline-none p-1">
            <Menu.Arrow className="[--arrow-size:12px] [--arrow-background:var(--color-teal-900)]">
              <Menu.ArrowTip />
            </Menu.Arrow>
            <Menu.Item
              value="signOut"
              className="px-4 py-2 w-full flex items-center gap-2 cursor-pointer ui-highlighted:bg-white/5 outline-none rounded-lg transition-colors duration-200"
              onClick={rockPaperScissors.quit}
            >
              <PowerIcon className="size-5" />
              Sign Out
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}

/* TODO */
function GameInfo() {
  return null;
}

function Leaderboard() {
  const rockPaperScissors = useRockPaperScissorsContext();

  return (
    <Dialog.Root lazyMount unmountOnExit>
      <Tooltip.Root openDelay={0} closeDelay={0}>
        <Tooltip.Trigger asChild>
          <Dialog.Trigger aria-label="Leaderboard">
            <MedalIcon className="size-5" />
          </Dialog.Trigger>
        </Tooltip.Trigger>
        <Tooltip.Positioner>
          <Tooltip.Content className="bg-white px-3 py-2 text-sm rounded-lg text-neutral-700 font-bold">
            <Tooltip.Arrow className="[--arrow-size:12px] [--arrow-background:white]">
              <Tooltip.ArrowTip />
            </Tooltip.Arrow>
            Leaderboard
          </Tooltip.Content>
        </Tooltip.Positioner>
      </Tooltip.Root>
      <Portal>
        <Dialog.Positioner className="fixed inset-0">
          <Dialog.Content className="w-96 fixed right-0 bottom-12 top-16 bg-white shadow-lg rounded-l-2xl ui-open:animate-drawer-in ui-closed:animate-drawer-out text-neutral-800 py-4 px-5 overflow-y-auto">
            <Dialog.Title className="flex items-center gap-2">
              <MedalIcon className="size-4" />
              <span className="font-bold">Leaderboard</span>
            </Dialog.Title>
            <div className="mt-5">
              {rockPaperScissors.leaderboard.map((entry) => (
                <LeaderboardItemContext value={entry}>
                  <LeaderboardItem />
                </LeaderboardItemContext>
              ))}
            </div>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

const LeaderboardItemContext = createContext<LeaderboardEntry | null>(null);
const useLeaderboardItemContext = () => {
  const context = useContext(LeaderboardItemContext);
  invariant(context);
  return context;
};

function LeaderboardItem() {
  const entry = useLeaderboardItemContext();

  return (
    <div className="flex items-center gap-2 border-t border-neutral-100 first:border-t-0 py-2 first:pt-0">
      <Avatar className="size-10" {...entry.player.avatar} />
      <div>
        <h2 className="text-sm font-bold">{entry.player.name}</h2>
        <div className="flex text-xs font-mono items-center gap-2">
          <div className="text-emerald-500 flex items-center gap-1">
            <TrendingUpIcon className="size-3" />
            <CountUp start={0} end={entry.score.wins} />
          </div>
          <div className="text-rose-500 flex items-center gap-1">
            <TrendingDownIcon className="size-3" />
            <CountUp start={0} end={entry.score.losses} />
          </div>
          <div className="text-amber-500 flex items-center gap-1">
            <TrendingUpDownIcon className="size-3" />
            <CountUp start={0} end={entry.score.ties} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="py-4 px-5 flex justify-center items-center gap-2">
      <CopyrightIcon className="size-4 text-white/75" />
      <p className="flex justify-center items-center gap-1 text-sm">
        Made with{' '}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-5 text-red-400"
        >
          <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
        </svg>
        by <span className="font-bold">BSIS-1B</span>
      </p>
    </footer>
  );
}
