import {createContext, useContext, useRef, useState} from 'react';
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

export interface Details__Playing {
  status: 'PLAYING';
  player: Player;
  round: number;
  score: Score;
}

export interface Details__Finished {
  status: 'FINISHED';
  player: Player;
  round: number;
  score: Score;
}

export interface Details__Waiting {
  status: 'WAITING';
  player?: never;
  round?: never;
  score?: never;
}

export type Details = Details__Playing | Details__Finished | Details__Waiting;

export type Choice = 'ROCK' | 'PAPER' | 'SCISSORS';

export interface LeaderboardEntry {
  player: Player;
  score: Score;
  totalRounds: number;
}

export type RockPaperScissorsEvent =
  | {
      type: 'ROUND_COMPLETE';
      status: 'WIN' | 'LOSS' | 'TIE';
      details: Details__Playing;
    }
  | {
      type: 'GAME_COMPLETE';
      status: 'WIN' | 'LOSS';
      details: Details__Finished;
    }
  | {
      type: 'LEADERBOARD_ACHIEVED';
      details: Details__Finished | Details__Playing;
    }
  | {
      type: 'GAME_ENDED';
      details?: never;
    }
  | {
      type: 'GAME_RESTARTED';
      details?: Details__Finished;
    }
  | {
      type: 'GAME_REQUEST';
      details?: never;
    };

export type Subscriber = (event: RockPaperScissorsEvent) => void;

export interface UseRockPaperScissorsReturn {
  startGame: (playerName: string) => void;
  restartGame: () => void;
  endGame: () => void;
  pick: (choice: Choice) => void;
  details: Details;
  leaderboard: LeaderboardEntry[];
  subscribe: (subscriber: Subscriber) => () => void;
}

export function useRockPaperScissors(): UseRockPaperScissorsReturn {
  const subscribers = useRef<Subscriber[]>([]);

  function subscribe(subscriber: Subscriber) {
    subscribers.current.push(subscriber);

    return () => {
      subscribers.current = subscribers.current.filter((s) => s !== subscriber);
    };
  }

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  const [details, setStatus] = useState<Details>({
    status: 'WAITING',
  });

  function startGame(playerName: string) {
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

  function endGame() {
    setStatus({
      status: 'WAITING',
    });

    subscribers.current.forEach((subscriber) => {
      subscriber({
        type: 'GAME_ENDED',
      });
    });
  }

  function restartGame() {
    if (details.status !== 'FINISHED') return;

    subscribers.current.forEach((subscriber) => {
      subscriber({
        type: 'GAME_RESTARTED',
        details,
      });
    });

    setStatus((prev) => {
      invariant(prev.status === 'FINISHED');

      return {
        status: 'PLAYING',
        player: prev.player,
        round: 1,
        score: {
          wins: 0,
          losses: 0,
          ties: 0,
        },
      };
    });
  }

  function updateLeaderboard(value: Details) {
    if (value.status === 'WAITING') return;

    if (leaderboard.length < 10) {
      setLeaderboard((prev) => {
        const l = [
          ...prev.filter((entry) => entry.player.id !== value.player.id),
          {
            player: value.player,
            score: value.score,
            totalRounds: value.round,
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

    const allWinScores = leaderboard
      .filter((entry) => entry.player.id === value.player.id)
      .map((entry) => entry.score.wins);

    const playerWinScore = value.score.wins;
    const shouldAddToLeaderboard = allWinScores.some((s) => s < playerWinScore);
    const isOnLeaderboard = leaderboard.some((l) => l.player.id === value.player.id);

    if (!shouldAddToLeaderboard) return;
    if (!isOnLeaderboard) {
      subscribers.current.forEach((subscriber) => {
        subscriber({
          type: 'LEADERBOARD_ACHIEVED',
          details: value,
        });
      });
    }

    /* 10 maximum leaderboard entries */
    setLeaderboard((prev) => {
      const l = [
        ...prev.filter((entry) => entry.player.id !== value.player.id),
        {
          player: value.player,
          score: value.score,
          totalRounds: value.round,
        },
      ];

      l.sort((a, b) => {
        if (a.score.wins > b.score.wins) return -1;
        if (a.score.wins < b.score.wins) return 1;
        return 0;
      });

      return l.slice(0, 10);
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

      updateLeaderboard({
        ...details,
        round: details.round + 1,
        score: {
          ...details.score,
          ties: details.score.ties + 1,
        },
      });

      subscribers.current.forEach((subscriber) => {
        subscriber({
          type: 'ROUND_COMPLETE',
          status: 'TIE',
          details,
        });
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

      updateLeaderboard({
        ...details,
        round: details.round + 1,
        score: {
          ...details.score,
          wins: details.score.wins + 1,
        },
      });

      subscribers.current.forEach((subscriber) => {
        subscriber({
          type: 'ROUND_COMPLETE',
          status: 'WIN',
          details,
        });
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

      updateLeaderboard({
        ...details,
        status: 'FINISHED',
        round: details.round + 1,
        score: {
          ...details.score,
          losses: 3,
        },
      });

      subscribers.current.forEach((subscriber) => {
        subscriber({
          type: 'GAME_COMPLETE',
          status: 'LOSS',
          details: {
            ...details,
            status: 'FINISHED',
            round: details.round + 1,
            score: {
              ...details.score,
              losses: 3,
            },
          },
        });
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

    updateLeaderboard({
      ...details,
      score: {
        ...details.score,
        losses: details.score.losses + 1,
      },
    });

    subscribers.current.forEach((subscriber) => {
      subscriber({
        type: 'ROUND_COMPLETE',
        status: 'LOSS',
        details,
      });
    });
  }

  return {
    startGame,
    restartGame,
    endGame,
    pick,
    details,
    leaderboard,
    subscribe,
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
