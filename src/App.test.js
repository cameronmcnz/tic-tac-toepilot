import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

describe('KickCatCopilot', () => {
  test('renders the best-of-5 experience', () => {
    render(<App />);

    expect(screen.getByText(/best-of-5 glitter combat/i)).toBeInTheDocument();
    expect(screen.getByText(/first to 3 crowns wins/i)).toBeInTheDocument();
    expect(screen.getByRole('grid', { name: /tic-tac-toe board/i })).toBeInTheDocument();
  });

  test('tracks a winning round and advances to the next round', () => {
    render(<App />);

    const moves = [1, 4, 2, 5, 3];
    moves.forEach((cellNumber) => {
      fireEvent.click(screen.getByRole('button', { name: new RegExp(`cell ${cellNumber}`, 'i') }));
    });

    expect(screen.getByText(/round 1 goes to player x/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next dramatic round/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /next dramatic round/i }));

    expect(screen.getByText(/round 2: player o, make your move/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cell 1, empty/i })).toBeInTheDocument();
  });
});
