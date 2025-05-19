import {Dialog, Field, Menu, Portal} from '@ark-ui/react';
import {
  CopyrightIcon,
  Gamepad2Icon,
  MedalIcon,
  PowerIcon,
  ScissorsLineDashed,
  Settings,
  XIcon,
} from 'lucide-react';
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
  return (
    <Dialog.Root>
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
            <Dialog.CloseTrigger className="absolute top-4 right-4 opacity-50 hover:opacity-100 transition-opacity duration-200">
              <XIcon className="size-5" />
            </Dialog.CloseTrigger>

            <ScissorsLineDashed className="size-10 text-white/60" />

            <form className="mt-10">
              <Field.Root>
                <Field.Label className="text-lg mb-2 block font-bold">Name</Field.Label>
                <Field.Input
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

        <Menu.Root>
          <Menu.Trigger>
            <Settings className="size-5" />
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content className="bg-teal-900 min-w-40 rounded-lg shadow-lg outline-none p-1">
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
      <Dialog.Trigger aria-label="Leaderboard">
        <MedalIcon className="size-5" />
      </Dialog.Trigger>
      <Portal>
        <Dialog.Positioner className="fixed inset-0">
          <Dialog.Content className="w-96 fixed right-0 bottom-12 top-16 bg-white shadow-lg rounded-l-2xl ui-open:animate-drawer-in ui-closed:animate-drawer-out"></Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
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
