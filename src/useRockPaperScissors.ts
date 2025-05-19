import {createContext, useContext, useState} from 'react';
import {genConfig, type AvatarFullConfig} from 'react-nice-avatar';
import {invariant} from './utils';

export interface Score {
  wins: number;
  losses: number;
  ties: number;
}

export interface Player {
  id: string;
  name: string;
  avatar: AvatarFullConfig;
}

export interface Playing {
  status: 'PLAYING';
  player: Player;
  round: number;
  score: Score;
}

export interface Finished {
  status: 'FINISHED';
  player: Player;
  round: number;
  score: Score;
}

export interface Waiting {
  status: 'WAITING';
  player?: never;
  round?: never;
  score?: never;
}

export type Details = Playing | Finished | Waiting;

export type Choice = 'ROCK' | 'PAPER' | 'SCISSORS';

export interface LeaderboardEntry {
  player: Player;
  score: Score;
  totalRounds: number;
}

export interface UseRockPaperScissorsReturn {
  play: (playerName: string) => void;
  restart: () => void;
  quit: () => void;
  pick: (choice: Choice) => void;
  details: Details;
  leaderboard: LeaderboardEntry[];
}

export function useRockPaperScissors(): UseRockPaperScissorsReturn {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  const [details, setStatus] = useState<Details>({
    status: 'WAITING',
  });

  function play(playerName: string) {
    setStatus({
      status: 'PLAYING',
      player: {
        id: window.crypto.randomUUID(),
        name: playerName,
        avatar: genConfig(),
      },
      round: 1,
      score: {
        wins: 0,
        losses: 0,
        ties: 0,
      },
    });
  }

  function quit() {
    setStatus({
      status: 'WAITING',
    });
  }

  function restart() {
    if (details.status !== 'FINISHED') return;

    setStatus((prev) => {
      invariant(prev.status === 'FINISHED');

      return {
        status: 'PLAYING',
        player: prev.player,
        round: 0,
        score: {
          wins: 0,
          losses: 0,
          ties: 0,
        },
      };
    });
  }

  function pick(choice: Choice) {
    if (details.status !== 'PLAYING') return;

    const computerChoice = randomChoice();

    if (choice === computerChoice) {
      setStatus((prev) => {
        invariant(prev.status === 'PLAYING');

        return {
          ...prev,
          round: prev.round + 1,
          score: {
            ...prev.score,
            ties: prev.score.ties + 1,
          },
        };
      });

      return;
    }

    if (
      (choice === 'ROCK' && computerChoice === 'SCISSORS') ||
      (choice === 'PAPER' && computerChoice === 'ROCK') ||
      (choice === 'SCISSORS' && computerChoice === 'PAPER')
    ) {
      setStatus((prev) => {
        invariant(prev.status === 'PLAYING');

        return {
          ...prev,
          round: prev.round + 1,
          score: {
            ...prev.score,
            wins: prev.score.wins + 1,
          },
        };
      });

      return;
    }

    if (details.score.losses >= 3) {
      setStatus((prev) => {
        invariant(prev.status === 'PLAYING');

        return {
          ...prev,
          status: 'FINISHED',
          round: prev.round + 1,
          score: {
            ...prev.score,
            losses: 3,
          },
        };
      });

      /* 10 maximum leaderboard entries */
      setLeaderboard((prev) => {
        const l = [
          ...prev,
          {
            player: details.player,
            score: details.score,
            totalRounds: details.round,
          },
        ];

        l.sort((a, b) => {
          if (a.score.wins > b.score.wins) return -1;
          if (a.score.wins < b.score.wins) return 1;
          return 0;
        });

        return l.slice(0, 10);
      });

      return;
    }

    setStatus((prev) => {
      invariant(prev.status === 'PLAYING');

      return {
        ...prev,
        round: prev.round + 1,
        score: {
          ...prev.score,
          losses: prev.score.losses + 1,
        },
      };
    });
  }

  return {
    play,
    restart,
    quit,
    pick,
    details,
    leaderboard,
  };
}

function randomChoice() {
  const choices: Choice[] = ['ROCK', 'PAPER', 'SCISSORS'];
  return choices[Math.floor(Math.random() * choices.length)];
}

export const RockPaperScissorsContext = createContext<UseRockPaperScissorsReturn | null>(null);
export const useRockPaperScissorsContext = () => {
  const context = useContext(RockPaperScissorsContext);
  invariant(context);
  return context;
};
