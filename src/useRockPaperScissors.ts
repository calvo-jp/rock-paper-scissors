import {createContext, useContext, useState} from 'react';
import {genConfig, type AvatarFullConfig} from 'react-nice-avatar';
import {invariant, toaster} from './utils';

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
  startGame: (playerName: string) => void;
  restartGame: () => void;
  endGame: () => void;
  pick: (choice: Choice) => void;
  details: Details;
  leaderboard: LeaderboardEntry[];
}

export function useRockPaperScissors(): UseRockPaperScissorsReturn {
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
  }

  function restartGame() {
    if (details.status !== 'FINISHED') return;

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
      toaster.success({
        title: 'Congratulations! 🎉',
        description: 'You made it to the leaderboard! 💪🏆',
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
  }

  return {
    startGame,
    restartGame,
    endGame,
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
