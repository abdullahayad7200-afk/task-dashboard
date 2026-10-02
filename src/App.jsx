import { useState } from 'react';
import {
  ArrowPathIcon,
  CheckIcon,
  DocumentDuplicateIcon,
  PencilSquareIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { MAX_DRAFT_LENGTH, refineText, validateDraft } from './features/writer/utils/refineText';
import './features/writer/writer.css';

const tones = [
  { id: 'clear', label: 'Clear & concise', description: 'Prefer simpler wording.' },
  { id: 'warm', label: 'Warm & conversational', description: 'Use natural contractions.' },
  { id: 'professional', label: 'Professional', description: 'Expand contractions.' },
];

function getWordCount(text) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function App() {
  const [draft, setDraft] = useState('');
  const [tone, setTone] = useState('clear');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleRefine = (event) => {
    event.preventDefault();
    const validationError = validateDraft(draft);

    if (validationError) {
      setError(validationError);
      setResult(null);
      return;
    }

    setError('');
    setCopied(false);
    setResult(refineText(draft, tone));
  };

  const handleDraftChange = (event) => {
    setDraft(event.target.value);
    setError('');
    setCopied(false);
  };

  const handleClear = () => {
    setDraft('');
    setResult(null);
    setError('');
    setCopied(false);
  };

  const handleCopy = async () => {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard access is unavailable in this browser.');
      }
      await navigator.clipboard.writeText(result.text);
      setCopied(true);
    } catch {
      setError('Could not copy your draft. Select the text and copy it manually.');
    }
  };

  return (
    <main className="writer-app">
      <div className="writer-shell">
        <header className="topbar">
          <a className="brand" href="/" aria-label="HumanizeX home">
            <span className="brand-mark">h<span>x</span></span>
            <span>Humanize<span className="brand-x">X</span></span>
          </a>
          <div className="privacy-note">
            <ShieldCheckIcon aria-hidden="true" />
            <span>Private by design <span className="privacy-divider">·</span> edits stay on your device</span>
          </div>
        </header>

        <section className="intro" aria-labelledby="page-title">
          <div className="eyebrow"><span /> YOUR WORDS, A LITTLE CLEARER</div>
          <h1 id="page-title">A thoughtful edit.<br /><span>Still your words.</span></h1>
          <p>Improve clarity and flow with a few careful edits. Your meaning stays yours.</p>
        </section>

        <form className="editor" onSubmit={handleRefine}>
          <section className="editor-panel source-panel" aria-labelledby="draft-title">
            <div className="panel-heading">
              <div>
                <div className="panel-kicker"><PencilSquareIcon aria-hidden="true" /> THE ORIGINAL</div>
                <h2 id="draft-title">Your draft</h2>
              </div>
              <span className="word-count">{getWordCount(draft)} words</span>
            </div>

            <label className="sr-only" htmlFor="draft-input">Paste or write your draft</label>
            <textarea
              id="draft-input"
              className="draft-input"
              value={draft}
              onChange={handleDraftChange}
              maxLength={MAX_DRAFT_LENGTH}
              placeholder="Drop your draft here. An email, a note, a paragraph — whatever you’re working on."
              aria-describedby="draft-hint draft-count"
            />
            <div className="input-meta">
              <span id="draft-hint">Your text is processed locally and is never uploaded.</span>
              <span id="draft-count">{draft.length.toLocaleString('en-US')} / {MAX_DRAFT_LENGTH.toLocaleString('en-US')}</span>
            </div>

            <fieldset className="tone-picker">
              <legend>Editing focus</legend>
              <div className="tone-options">
                {tones.map((option) => (
                  <button
                    key={option.id}
                    className={`tone-option${tone === option.id ? ' selected' : ''}`}
                    type="button"
                    aria-pressed={tone === option.id}
                    title={option.description}
                    onClick={() => setTone(option.id)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="editor-actions">
              <button className="refine-button" type="submit">
                <SparklesIcon aria-hidden="true" />
                Refine my writing
              </button>
              <button className="clear-button" type="button" onClick={handleClear} disabled={!draft && !result}>
                Clear
              </button>
            </div>
            {error && <p className="error-message" role="alert">{error}</p>}
          </section>

          <section className="editor-panel result-panel" aria-labelledby="result-title">
            <div className="panel-heading">
              <div>
                <div className="panel-kicker"><SparklesIcon aria-hidden="true" /> THE REFINED VERSION</div>
                <h2 id="result-title">A clearer draft</h2>
              </div>
              {result && (
                <button
                  className={`copy-button${copied ? ' copied' : ''}`}
                  type="button"
                  onClick={handleCopy}
                  aria-label={copied ? 'Copied refined draft' : 'Copy refined draft'}
                >
                  {copied ? <CheckIcon aria-hidden="true" /> : <DocumentDuplicateIcon aria-hidden="true" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              )}
            </div>

            {result ? (
              <div className="result-content" aria-live="polite">
                <textarea className="result-text" aria-label="Refined draft" readOnly value={result.text} />
                <div className="result-summary">
                  <span className="summary-icon"><CheckIcon aria-hidden="true" /></span>
                  {result.changes.length > 0
                    ? `${result.changes.length} small ${result.changes.length === 1 ? 'edit' : 'edits'} for clarity and tone. Review them before using your draft.`
                    : 'No matching phrase edits this time. Your draft is ready to review as written.'}
                </div>
                {result.changes.length > 0 && (
                  <details className="edit-details">
                    <summary>See the edits</summary>
                    <ul>
                      {result.changes.map((change, index) => (
                        <li key={`${change.from}-${index}`}>
                          <span>{change.from}</span><span aria-hidden="true">→</span><span>{change.to}</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            ) : (
              <div className="result-empty">
                <div className="empty-icon"><ArrowPathIcon aria-hidden="true" /></div>
                <h3>Your refined draft will appear here</h3>
                <p>Choose an editing focus, then refine your draft. You’re always in control of the final wording.</p>
              </div>
            )}
            <div className="method-note">
              <span className="method-dot" />
              <p><strong>Simple, transparent edits.</strong> This first version uses a small set of phrase and contraction rules — not an AI model. It won’t invent new wording or reliably assess context, so please review every edit.</p>
            </div>
          </section>
        </form>

        <footer className="footer">
          <span>Thoughtful writing starts with your own voice.</span>
          <span><ShieldCheckIcon aria-hidden="true" /> Nothing is sent to a server.</span>
        </footer>
      </div>
    </main>
  );
}

export default App;
