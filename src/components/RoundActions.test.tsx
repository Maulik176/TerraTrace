import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import RoundActions from './RoundActions';

describe('RoundActions', () => {
  it('disables confirm button until a guess exists', () => {
    const onConfirm = vi.fn();

    const { rerender } = render(<RoundActions hasGuess={false} onConfirm={onConfirm} />);
    const button = screen.getByRole('button', { name: /confirm guess/i });

    expect(button).toBeDisabled();

    rerender(<RoundActions hasGuess onConfirm={onConfirm} />);
    expect(button).toBeEnabled();

    fireEvent.click(button);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
