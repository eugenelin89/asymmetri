"use client";
import { useEffect, useRef, useState } from "react";
import type { Character, Link } from "./types";
import { safeExternalUrl } from "./registry";
import { ReportProfile } from "./community/ProfilePanel";
import {
  respond,
  suggestedTopics,
  type ConversationAction,
  type ConversationState,
  type ConversationTurn,
  type Gesture,
} from "./conversation";
import styles from "./conversation.module.css";

function References({ links }: { links: Link[] }) {
  return (
    <div className={styles.sources}>
      {links
        .filter((l) => safeExternalUrl(l.url))
        .map((l) => (
          <a
            key={l.url}
            href={safeExternalUrl(l.url)!}
            target="_blank"
            rel="noopener noreferrer"
          >
            {l.label} ↗
          </a>
        ))}
    </div>
  );
}

export function Conversation({
  character,
  state,
  onChange,
  onReact,
  onClose,
}: {
  character: Character;
  state: ConversationState;
  onChange: (state: ConversationState) => void;
  onReact: (gesture: Gesture) => void;
  onClose: () => void;
}) {
  const [turn, setTurn] = useState<ConversationTurn | null>(null);
  const [menu, setMenu] = useState(false),
    [page, setPage] = useState(0),
    [question, setQuestion] = useState("");
  const response = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (turn) response.current?.focus({ preventScroll: true });
  }, [turn]);
  const choose = (action: ConversationAction) => {
    const next = respond(character, state, action);
    if (next === state) return;
    const latest = next.turns.at(-1)!;
    onChange(next);
    setTurn(latest);
    setMenu(false);
    setQuestion("");
    onReact(latest.gesture);
  };
  const ended = turn?.action === "goodbye";
  const suggested = suggestedTopics(character, state, turn);
  const name = state.introduced ? character.name : "Someone nearby";
  const participantAnswer =
    character.category === "community" && !!turn?.topicId;
  return (
    <div className={styles.conversation}>
      <header className={styles.header}>
        <div>
          <span className={styles.eyebrow}>CAMPUS CONVERSATION</span>
          <h2>{name}</h2>
        </div>
        <button aria-label="End conversation" onClick={onClose}>
          ×
        </button>
      </header>
      <p className={styles.context}>
        {character.category === "community"
          ? "Virtual character · participant-written topics · not live chat"
          : character.category === "fictional"
            ? "Fictional guide · scripted conversation"
            : "Educational simulation · scripted responses, not the real person"}
      </p>

      <div
        ref={response}
        className={styles.response}
        tabIndex={-1}
        aria-label="Character response"
        aria-live="polite"
        aria-atomic="true"
      >
        {turn ? (
          <>
            <div className={styles.you}>You · {turn.said}</div>
            <span className={styles.speaker}>
              {participantAnswer
                ? "Their written answer"
                : state.introduced
                  ? `${character.name} · virtual character`
                  : "Virtual character"}
            </span>
            <p>{turn.answer}</p>
            <span className={styles.reaction}>
              {turn.gesture === "wave"
                ? "Waves back"
                : turn.gesture === "nod"
                  ? "Nods"
                  : "Turns toward you and responds"}
            </span>
          </>
        ) : (
          <>
            <span className={styles.speaker}>
              {state.introduced ? "You meet again" : "A chance encounter"}
            </span>
            <p>
              They pause and turn toward you. What would you like to say or do?
            </p>
          </>
        )}
      </div>

      <div className={styles.choices} aria-label="Conversation choices">
        {ended ? (
          <>
            <button className={styles.primary} onClick={onClose}>
              Continue exploring →
            </button>
            <button
              onClick={() => {
                setTurn(null);
                setMenu(false);
              }}
            >
              Actually, one more question…
            </button>
          </>
        ) : menu ? (
          <>
            <span className={styles.choiceHeading}>Choose a question</span>
            {character.topics.slice(page * 4, page * 4 + 4).map((t) => (
              <button
                key={t.id}
                onClick={() => choose({ kind: "topic", id: t.id })}
              >
                <span>Ask</span>
                {t.question}
              </button>
            ))}
            <div className={styles.paging}>
              <button onClick={() => setMenu(false)}>← Back</button>
              {page > 0 && (
                <button onClick={() => setPage(page - 1)}>
                  Previous questions
                </button>
              )}
              {(page + 1) * 4 < character.topics.length && (
                <button onClick={() => setPage(page + 1)}>
                  More questions →
                </button>
              )}
            </div>
          </>
        ) : !turn ? (
          <>
            <button onClick={() => choose({ kind: "hello" })}>
              <span>Say</span>Hello!
            </button>
            <button onClick={() => choose({ kind: "introduce" })}>
              <span>Ask</span>Who are you?
            </button>
            <button
              onClick={() => {
                setMenu(true);
                setPage(0);
              }}
            >
              <span>Ask</span>A question…
            </button>
            <button onClick={() => choose({ kind: "wave" })}>
              <span>Do</span>Wave hello
            </button>
          </>
        ) : (
          <>
            <span className={styles.choiceHeading}>
              What would you like to say next?
            </span>
            {!state.introduced && (
              <button onClick={() => choose({ kind: "introduce" })}>
                Who are you?
              </button>
            )}
            {suggested.slice(0, state.introduced ? 3 : 2).map((t) => (
              <button
                key={t.id}
                onClick={() => choose({ kind: "topic", id: t.id })}
              >
                {t.question}
              </button>
            ))}
            <button
              onClick={() => {
                setMenu(true);
                setPage(0);
              }}
            >
              Ask something else…
            </button>
          </>
        )}
      </div>

      {!ended && (
        <div className={styles.social}>
          {turn && (
            <button onClick={() => choose({ kind: "thanks" })}>
              Say thanks
            </button>
          )}
          <button onClick={() => choose({ kind: "goodbye" })}>
            Say goodbye
          </button>
          {turn && (
            <button onClick={() => choose({ kind: "wave" })}>Wave</button>
          )}
        </div>
      )}

      <div className={styles.details}>
        {!ended && (
          <details>
            <summary>Type your own question</summary>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                choose({ kind: "question", text: question });
              }}
            >
              <label htmlFor="campus-conversation-question">
                Your question
              </label>
              <div className={styles.inputRow}>
                <input
                  id="campus-conversation-question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  maxLength={240}
                  placeholder="Ask about an available topic"
                />
                <button type="submit" disabled={!question.trim()}>
                  Ask
                </button>
              </div>
              <small>
                Uses reviewed topics. Unsupported questions get an honest “I
                don’t know.”
              </small>
            </form>
          </details>
        )}
        {!!turn?.sources.length && (
          <details key={`sources-${state.turns.length}`}>
            <summary>Sources for this answer</summary>
            <References links={turn.sources} />
          </details>
        )}
        {!!state.turns.length && (
          <details>
            <summary>Conversation so far ({state.turns.length})</summary>
            <div className={styles.history}>
              {state.turns.map((t, i) => (
                <article key={i}>
                  <strong>You · {t.said}</strong>
                  <p>{t.answer}</p>
                </article>
              ))}
            </div>
          </details>
        )}
        <details>
          <summary>About this simulation</summary>
          <p>
            {character.disclaimer} All social gestures and greetings are
            scripted. This is not a real person’s location or participation.
          </p>
          {state.introduced && (
            <>
              <p>{character.title}</p>
              <References links={character.sources} />
              <small>
                {character.category === "community" ? "Updated" : "Verified"}{" "}
                {character.verified}
              </small>
            </>
          )}
          {character.category === "community" && (
            <ReportProfile id={character.id.slice("community-".length)} />
          )}
        </details>
      </div>
    </div>
  );
}
