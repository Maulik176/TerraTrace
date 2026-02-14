import type { KeyboardEvent } from 'react';

type RoundActionsProps = {
  hasGuess: boolean;
  onConfirm: () => void;
  disabled?: boolean;
};

function RoundActions({ hasGuess, onConfirm, disabled = false }: RoundActionsProps): JSX.Element {
  const isDisabled = disabled || !hasGuess;

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' && !isDisabled) {
      onConfirm();
    }
  };

  return (
    <button
      type="button"
      className="btn-primary w-full"
      disabled={isDisabled}
      onClick={onConfirm}
      onKeyDown={onKeyDown}
    >
      Confirm Guess
    </button>
  );
}

export default RoundActions;
