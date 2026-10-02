import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import App from './App';

describe('HumanizeX writing editor', () => {
  test('shows validation feedback for an empty draft', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Refine my writing' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Add a draft');
    expect(screen.queryByLabelText('Refined draft')).not.toBeInTheDocument();
  });

  test('refines supported phrases and tone, and shows the edits', () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText('Paste or write your draft'), {
      target: { value: 'We are unable to utilize this tool in order to help.' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Warm & conversational' }));
    fireEvent.click(screen.getByRole('button', { name: 'Refine my writing' }));

    expect(screen.getByLabelText('Refined draft').value)
      .toBe("We're unable to use this tool to help.");
    expect(screen.getByText('3 small edits for clarity and tone. Review them before using your draft.'))
      .toBeInTheDocument();
    expect(screen.getByText('See the edits')).toBeInTheDocument();
  });

  test('clears the draft and refined version', () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText('Paste or write your draft'), {
      target: { value: 'In order to help, use this.' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Refine my writing' }));
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));

    expect(screen.getByLabelText('Paste or write your draft').value).toBe('');
    expect(screen.queryByLabelText('Refined draft')).not.toBeInTheDocument();
  });
});
