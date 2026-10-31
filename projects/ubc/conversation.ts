import type { Character, Link } from "./types";
import { answerQuestion } from "./registry";

export type Gesture = "wave" | "nod" | "talk";
export type ConversationAction =
  | { kind: "hello" | "introduce" | "wave" | "thanks" | "goodbye" }
  | { kind: "topic"; id: string }
  | { kind: "question"; text: string };
export type ConversationTurn = {
  action: ConversationAction["kind"];
  said: string;
  answer: string;
  gesture: Gesture;
  sources: Link[];
  topicId?: string;
  followups: string[];
};
export type ConversationState = {
  introduced: boolean;
  turns: ConversationTurn[];
};
export const emptyConversation = (): ConversationState => ({
  introduced: false,
  turns: [],
});

/** Original scripted social actions; factual answers remain the reviewed registry text. */
export function respond(
  character: Character,
  state: ConversationState,
  action: ConversationAction,
): ConversationState {
  let turn: ConversationTurn;
  const base = {
    action: action.kind,
    sources: [] as Link[],
    followups: [] as string[],
  };
  if (action.kind === "topic" || action.kind === "question") {
    const said =
      action.kind === "question" ? action.text.trim().slice(0, 240) : "";
    if (action.kind === "question" && !said) return state;
    const topic =
      action.kind === "topic"
        ? character.topics.find((t) => t.id === action.id)
        : answerQuestion(character, said);
    if (action.kind === "topic" && !topic) return state;
    turn = {
      ...base,
      said: action.kind === "topic" ? topic!.question : said,
      answer:
        topic?.answer ||
        (character.category === "community"
          ? "This participant hasn’t written an answer to that question. Try one of their available topics; they are not answering live."
          : "I don’t have a verified answer to that. Try one of the available questions or check the sources. This simulated guide cannot speak for the real person, give private opinions, track whereabouts or make promises."),
      gesture: "talk",
      sources: topic?.sources || character.sources,
      topicId: topic?.id,
      followups:
        topic?.followups?.filter((id) =>
          character.topics.some((t) => t.id === id),
        ) || [],
    };
  } else {
    const responses = {
      hello: {
        said: "Hello!",
        answer: "Hello! Take a moment to chat. What would you like to ask?",
        gesture: "wave",
      },
      introduce: {
        said: "Who are you?",
        answer: `${character.name} — ${character.title}. ${character.biography}`,
        gesture: "talk",
      },
      wave: {
        said: "Wave hello",
        answer: "They smile and wave back, ready to chat.",
        gesture: "wave",
      },
      thanks: {
        said: "Thanks for chatting.",
        answer: "You’re welcome. Anything else you’d like to explore?",
        gesture: "nod",
      },
      goodbye: {
        said: "See you around!",
        answer: "They wave goodbye. Enjoy the rest of your campus visit!",
        gesture: "wave",
      },
    } satisfies Record<
      string,
      { said: string; answer: string; gesture: Gesture }
    >;
    turn = {
      ...base,
      ...responses[action.kind],
      sources: action.kind === "introduce" ? character.sources : [],
    };
  }
  return {
    introduced: state.introduced || action.kind === "introduce",
    turns: [...state.turns, turn].slice(-24),
  };
}

export function suggestedTopics(
  character: Character,
  state: ConversationState,
  turn: ConversationTurn | null,
) {
  const asked = new Set(state.turns.map((t) => t.topicId));
  const ids = [
    ...(turn?.followups || []),
    ...character.topics.filter((t) => !asked.has(t.id)).map((t) => t.id),
  ];
  return [...new Set(ids)]
    .map((id) => character.topics.find((t) => t.id === id)!)
    .filter(Boolean)
    .slice(0, 3);
}
