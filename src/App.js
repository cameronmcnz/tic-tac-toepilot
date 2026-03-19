import { useMemo, useState } from 'react';
import './App.css';

const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const EMPTY_BOARD = Array(9).fill(null);

const PLAYER_STYLES = {
  X: {
    label: 'Player X',
    glyph: 'X',
    mood: 'pink glitter menace',
    taunt: 'Serve drama. Snatch the diagonal. Pretend this is self-care.',
  },
  O: {
    label: 'Player O',
    glyph: 'O',
    mood: 'lilac chaos orb',
    taunt: 'Block with grace, sparkle with intent, and be a little unbearable.',
  },
};

function calculateWinner(board) {
  for (const line of WINNING_LINES) {
    const [first, second, third] = line;
    if (
      board[first] &&
      board[first] === board[second] &&
      board[first] === board[third]
    ) {
      return { symbol: board[first], line };
    }
  }

  return null;
}

function getStatusMessage(roundOutcome, roundNumber, currentPlayer) {
  if (roundOutcome?.type === 'match') {
    return `Player ${roundOutcome.winner} wins the best-of-5 crown!`;
  }

  if (roundOutcome?.type === 'winner') {
    return `Round ${roundNumber} goes to Player ${roundOutcome.winner}.`;
  }

  if (roundOutcome?.type === 'draw') {
    return `Round ${roundNumber} ends in a dramatic draw.`;
  }

  return `Round ${roundNumber}: Player ${currentPlayer}, make your move.`;
}

function getSubStatus(roundOutcome, currentPlayer, ties, scores) {
  if (roundOutcome?.type === 'match') {
    return 'The glitter cannon fired, the crowd sighed, and the crown has been assigned.';
  }

  if (roundOutcome?.type === 'winner') {
    return 'Click into the next round whenever you are emotionally prepared.';
  }

  if (roundOutcome?.type === 'draw') {
    return 'Nobody earned a crown, but everybody definitely earned side-eye.';
  }

  const onMatchPoint = scores.X === 2 || scores.O === 2;
  if (onMatchPoint) {
    return 'Match point energy is in the air, which feels supportive and deeply judgmental.';
  }

  if (ties > 0) {
    return 'Draws do not award crowns, because chaos is not a scoring system.';
  }

  return PLAYER_STYLES[currentPlayer].taunt;
}

function App() {
  const [board, setBoard] = useState(EMPTY_BOARD);
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [startingPlayer, setStartingPlayer] = useState('X');
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [ties, setTies] = useState(0);
  const [roundNumber, setRoundNumber] = useState(1);
  const [winningLine, setWinningLine] = useState([]);
  const [roundOutcome, setRoundOutcome] = useState(null);

  const statusMessage = getStatusMessage(roundOutcome, roundNumber, currentPlayer);
  const subStatus = getSubStatus(roundOutcome, currentPlayer, ties, scores);
  const crownsToWin = 3;
  const chaosLevel = useMemo(() => {
    const base = 32;
    const tieBonus = ties * 14;
    const matchPointBonus = scores.X === 2 || scores.O === 2 ? 24 : 0;
    return Math.min(base + tieBonus + matchPointBonus, 100);
  }, [scores.O, scores.X, ties]);

  const isBoardLocked = Boolean(roundOutcome);

  function handleCellClick(index) {
    if (board[index] || isBoardLocked) {
      return;
    }

    const nextBoard = [...board];
    nextBoard[index] = currentPlayer;
    const winner = calculateWinner(nextBoard);

    setBoard(nextBoard);

    if (winner) {
      const updatedScores = {
        ...scores,
        [winner.symbol]: scores[winner.symbol] + 1,
      };

      setScores(updatedScores);
      setWinningLine(winner.line);

      if (updatedScores[winner.symbol] >= crownsToWin) {
        setRoundOutcome({ type: 'match', winner: winner.symbol });
      } else {
        setRoundOutcome({ type: 'winner', winner: winner.symbol });
      }

      return;
    }

    if (nextBoard.every(Boolean)) {
      setTies((currentTies) => currentTies + 1);
      setWinningLine([]);
      setRoundOutcome({ type: 'draw' });
      return;
    }

    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  }

  function resetBoardOnly() {
    setBoard(EMPTY_BOARD);
    setCurrentPlayer(startingPlayer);
    setWinningLine([]);
    setRoundOutcome(null);
  }

  function startNextRound() {
    const nextStartingPlayer = startingPlayer === 'X' ? 'O' : 'X';
    setBoard(EMPTY_BOARD);
    setCurrentPlayer(nextStartingPlayer);
    setStartingPlayer(nextStartingPlayer);
    setWinningLine([]);
    setRoundOutcome(null);
    setRoundNumber((currentRound) => currentRound + 1);
  }

  function resetMatch() {
    setBoard(EMPTY_BOARD);
    setCurrentPlayer('X');
    setStartingPlayer('X');
    setScores({ X: 0, O: 0 });
    setTies(0);
    setRoundNumber(1);
    setWinningLine([]);
    setRoundOutcome(null);
  }

  return (
    <main className="app-shell">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />

      <section className="app-card">
        <header className="hero">
          <p className="eyebrow">Kick-Cat-Copilot</p>
          <h1>Best-of-5 glitter combat.</h1>
          <p className="hero-copy">
            A dark-mode tic-tac-toe showdown with feminine colors, teasing little
            flourishes, and exactly the kind of extra behavior that makes people roll
            their eyes before playing another round.
          </p>

          <div className="hero-badges">
            <span className="badge">First to 3 crowns wins</span>
            <span className="badge">Draws are pure drama</span>
            <span className="badge">Theme: midnight blush</span>
          </div>
        </header>

        <section className="status-panel" aria-live="polite">
          <div>
            <p className="status-kicker">Current mood</p>
            <h2>{statusMessage}</h2>
            <p className="status-copy">{subStatus}</p>
          </div>

          <div className="chaos-card" aria-label={`Chaos meter at ${chaosLevel}%`}>
            <div className="chaos-copy">
              <span>Chaos meter</span>
              <strong>{chaosLevel}%</strong>
            </div>
            <div className="chaos-bar">
              <span style={{ width: `${chaosLevel}%` }} />
            </div>
          </div>
        </section>

        <section className="match-layout">
          <aside className="scoreboard">
            {Object.entries(PLAYER_STYLES).map(([symbol, player]) => {
              const isActive = !roundOutcome && currentPlayer === symbol;
              const isLeader = scores[symbol] > scores[symbol === 'X' ? 'O' : 'X'];

              return (
                <article
                  key={symbol}
                  className={`score-card score-card--${symbol.toLowerCase()}${
                    isActive ? ' is-active' : ''
                  }${isLeader ? ' is-leading' : ''}`}
                >
                  <div className="score-header">
                    <span className="score-glyph">{player.glyph}</span>
                    <div>
                      <p>{player.label}</p>
                      <small>{player.mood}</small>
                    </div>
                  </div>

                  <div className="score-value">
                    <strong>{scores[symbol]}</strong>
                    <span>crowns</span>
                  </div>
                </article>
              );
            })}

            <article className="mini-card">
              <p>Round</p>
              <strong>{roundNumber}</strong>
              <span>Starter: Player {startingPlayer}</span>
            </article>

            <article className="mini-card">
              <p>Draw archive</p>
              <strong>{ties}</strong>
              <span>Because indecision is a lifestyle.</span>
            </article>
          </aside>

          <section className="board-panel">
            <div
              className={`board ${roundOutcome ? 'board--locked' : ''}`}
              role="grid"
              aria-label="Tic-tac-toe board"
            >
              {board.map((cell, index) => {
                const isWinningCell = winningLine.includes(index);

                return (
                  <button
                    key={index}
                    type="button"
                    className={`cell ${isWinningCell ? 'cell--winner' : ''}`}
                    onClick={() => handleCellClick(index)}
                    disabled={isBoardLocked}
                    aria-label={`Cell ${index + 1}${cell ? `, ${cell}` : ', empty'}`}
                  >
                    <span className={`token ${cell ? `token--${cell.toLowerCase()}` : ''}`}>
                      {cell}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="action-row">
              <button type="button" className="action-button" onClick={resetBoardOnly}>
                Reset board
              </button>

              {roundOutcome && roundOutcome.type !== 'match' ? (
                <button type="button" className="action-button action-button--primary" onClick={startNextRound}>
                  Next dramatic round
                </button>
              ) : null}

              <button
                type="button"
                className="action-button action-button--ghost"
                onClick={resetMatch}
              >
                Reset full match
              </button>
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}

export default App;
