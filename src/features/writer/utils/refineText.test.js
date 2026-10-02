import { describe, expect, test } from 'vitest';
import { MAX_DRAFT_LENGTH, refineText, validateDraft } from './refineText';

describe('validateDraft', () => {
  test('requires non-empty text', () => {
    expect(validateDraft(' \n\t')).toBe('Add a draft before refining your writing.');
  });

  test('rejects drafts over the character limit', () => {
    expect(validateDraft('x'.repeat(MAX_DRAFT_LENGTH + 1))).toContain('5,000 characters');
  });

  test('accepts a draft at the character limit', () => {
    expect(validateDraft('x'.repeat(MAX_DRAFT_LENGTH))).toBe('');
  });
});

describe('refineText', () => {
  test('simplifies supported wordy phrases and reports each edit', () => {
    const result = refineText('  Due to the fact that we utilize it, make a decision.  ');

    expect(result.text).toBe('Because we use it, decide.');
    expect(result.changes).toEqual([
      { from: 'Due to the fact that', to: 'Because' },
      { from: 'make a decision', to: 'decide' },
      { from: 'utilize', to: 'use' },
    ]);
  });

  test('uses contractions for the warm focus and expands them for professional', () => {
    expect(refineText('We are ready; do not wait.', 'warm').text)
      .toBe("We're ready; don't wait.");
    expect(refineText("We're ready; don't wait.", 'professional').text)
      .toBe('We are ready; do not wait.');
  });

  test('does not change a matching word inside a larger word', () => {
    expect(refineText('Reutilize the tool and utilize it.').text)
      .toBe('Reutilize the tool and use it.');
  });

  test('rejects blank drafts and unsupported focus values', () => {
    expect(() => refineText('  ')).toThrow('Add a draft');
    expect(() => refineText('Some text', 'casual')).toThrow('Unsupported editing focus');
  });
});
