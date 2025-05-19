import {Dialog, Field, Menu, Portal, Tooltip} from '@ark-ui/react';
import {
  CopyrightIcon,
  Gamepad2Icon,
  MedalIcon,
  PowerIcon,
  ScissorsLineDashed,
  Settings,
  TrendingDownIcon,
  TrendingUpDownIcon,
  TrendingUpIcon,
  XIcon,
} from 'lucide-react';
import {useRef} from 'react';
import Confetti from 'react-confetti-explosion';
import Avatar from 'react-nice-avatar';
import {PaperIcon} from './PaperIcon';
import {RockIcon} from './RockIcon';
import {ScissorsIcon} from './ScissorsIcon';

export function RockPaperScissors() {
  return (
    <div className="flex flex-col min-h-dvh">
      <Navbar />

      <main className="flex flex-col items-center justify-center grow">
        <h1 className="text-5xl font-bold">Rock Paper Scissors</h1>
        <nav className="mt-32 flex items-center gap-10">
          <Confetti />

          <button
            type="button"
            className="shrink-0 p-4 bg-teal-800/15 rounded-full hover:scale-110 transition-transform duration-200"
            aria-label="Rock"
          >
            <RockIcon className="size-40 text-teal-100" />
          </button>
          <button
            type="button"
            className="shrink-0 p-4 bg-teal-800/15 rounded-full hover:scale-110 transition-transform duration-200"
            aria-label="Paper"
          >
            <PaperIcon className="size-40 text-teal-100" />
          </button>
          <button
            type="button"
            className="shrink-0 p-4 bg-teal-800/15 rounded-full hover:scale-110 transition-transform duration-200"
            aria-label="Scissors"
          >
            <ScissorsIcon className="size-40 text-teal-100" />
          </button>
        </nav>
        <div className="mt-28">
          <PlayButton />
        </div>
      </main>

      <Footer />
    </div>
  );
}

function PlayButton() {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Dialog.Root initialFocusEl={() => inputRef.current}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="px-6 py-3 text-xl bg-teal-800/15 flex items-center justify-center gap-2 rounded-full font-bold ui-not-open:animate-bounce"
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

            <form className="mt-10">
              <Field.Root>
                <Field.Label className="text-lg mb-2 block font-bold">Name</Field.Label>
                <Field.Input
                  ref={inputRef}
                  className="block w-full h-14 px-5 text-lg border border-teal-700 outline-none rounded-full bg-teal-800/50"
                  placeholder="eg. Mario"
                />
              </Field.Root>
              <button className="block w-full h-14 mt-8 bg-white rounded-full text-teal-800 font-bold text-lg">
                Continue
              </button>
            </form>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

function Navbar() {
  return (
    <header className="flex py-4 px-5 justify-between items-center">
      <ScissorsLineDashed className="size-6 text-white/60" />
      <div className="flex items-center gap-2">
        <span>Hi, Guest!</span>

        <Menu.Root positioning={{placement: 'bottom'}}>
          <Menu.Trigger>
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
                >
                  <PowerIcon className="size-5" />
                  Sign Out
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>

        <Leaderboard />
      </div>
    </header>
  );
}

function Leaderboard() {
  return (
    <Dialog.Root>
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
              <LeaderboardItem />
              <LeaderboardItem />
              <LeaderboardItem />
            </div>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

function LeaderboardItem() {
  return (
    <div className="flex items-center gap-2 border-t border-neutral-100 first:border-t-0 py-2 first:pt-0">
      <div className="size-10 bg-neutral-50 rounded-full flex items-center justify-center">
        <Avatar className="size-full" />
      </div>
      <div>
        <h2 className="text-sm font-bold">Fenilyn</h2>
        <div className="flex items-center gap-2">
          <div className="text-xs text-emerald-500 flex items-center gap-1">
            <TrendingUpIcon className="size-3" />
            <span>300</span>
          </div>
          <div className="text-xs text-rose-500 flex items-center gap-1">
            <TrendingDownIcon className="size-3" />
            <span>50</span>
          </div>
          <div className="text-xs text-amber-500 flex items-center gap-1">
            <TrendingUpDownIcon className="size-3" />
            <span>4</span>
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
