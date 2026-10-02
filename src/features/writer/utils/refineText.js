export const MAX_DRAFT_LENGTH = 5000;

const clarityReplacements = [
  ['due to the fact that', 'because'],
  ['at this point in time', 'now'],
  ['has the ability to', 'can'],
  ['make a decision', 'decide'],
  ['in order to', 'to'],
  ['utilize', 'use'],
];

const warmReplacements = [
  ['we are', "we're"],
  ['you are', "you're"],
  ['they are', "they're"],
  ['it is', "it's"],
  ['I am', "I'm"],
  ['cannot', "can't"],
  ['will not', "won't"],
  ['do not', "don't"],
];

const professionalReplacements = [
  ["we're", 'we are'],
  ["you're", 'you are'],
  ["they're", 'they are'],
  ["it's", 'it is'],
  ["I'm", 'I am'],
  ["can't", 'cannot'],
  ["won't", 'will not'],
  ["don't", 'do not'],
];

function preserveCapitalization(original, replacement) {
  if (original === original.toUpperCase()) {
    return replacement.toUpperCase();
  }
  if (original[0] === original[0].toUpperCase()) {
    return replacement[0].toUpperCase() + replacement.slice(1);
  }
  return replacement;
}

function applyReplacements(text, replacements, changes) {
  let result = text;

  for (const [from, to] of replacements) {
    const expression = new RegExp(`\\b${from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    result = result.replace(expression, (match) => {
      const replacement = preserveCapitalization(match, to);
      changes.push({ from: match, to: replacement });
      return replacement;
    });
  }

  return result;
}

export function validateDraft(text) {
  if (!text.trim()) {
    return 'Add a draft before refining your writing.';
  }
  if (text.length > MAX_DRAFT_LENGTH) {
    return `Keep your draft under ${MAX_DRAFT_LENGTH.toLocaleString('en-US')} characters.`;
  }
  return '';
}

export function refineText(text, tone = 'clear') {
  const validationError = validateDraft(text);
  if (validationError) {
    throw new TypeError(validationError);
  }
  if (!['clear', 'warm', 'professional'].includes(tone)) {
    throw new RangeError(`Unsupported editing focus: ${tone}`);
  }

  const changes = [];
  let refined = text
    .replace(/[ \t]{2,}/g, ' ')
    .trim();

  refined = applyReplacements(refined, clarityReplacements, changes);

  if (tone === 'warm') {
    refined = applyReplacements(refined, warmReplacements, changes);
  } else if (tone === 'professional') {
    refined = applyReplacements(refined, professionalReplacements, changes);
  }

  return { text: refined, changes };
}
