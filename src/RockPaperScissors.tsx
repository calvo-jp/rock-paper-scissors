import {Gamepad2Icon} from 'lucide-react';
import {PaperIcon} from './PaperIcon';
import {RockIcon} from './RockIcon';
import {Layout} from './RootLayout';
import {ScissorsIcon} from './ScissorsIcon';

export function RockPaperScissors() {
  return (
    <Layout>
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
        <button
          type="button"
          className="animate-bounce px-6 py-3 text-xl bg-teal-800/15 flex items-center justify-center gap-2 rounded-full font-bold"
        >
          <Gamepad2Icon className="size-7" />
          Play Now!
        </button>
      </div>
    </Layout>
  );
}
