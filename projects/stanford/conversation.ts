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

/** Recognize only complete social phrases; never swallow an unsupported follow-up. */
function socialAction(text: string): ConversationAction | null {
  const q = text.toLowerCase().replace(/[’']/g, "'").replace(/[.!?,]+$/g, "").trim();
  const identity = q
    .replace(/^(?:hi|hello|hey)(?: there)?[,!.\s]+/, "")
    .replace(/^please\s+/, "")
    .replace(/,?\s+please$/, "");
  if (/^(who are you|what's your name|what is your name|introduce yourself|can you introduce yourself|tell me your name|can you tell me your name)$/.test(identity))
    return { kind: "introduce" };
  if (/^(hi|hello|hey|hi there|hello there)$/.test(q))
    return { kind: "hello" };
  if (/^(thanks|thank you|thanks for chatting|thank you for your help)$/.test(q))
    return { kind: "thanks" };
  if (/^(bye|goodbye|see you|see you around)$/.test(q))
    return { kind: "goodbye" };
  return null;
}

/** Original scripted social actions; factual answers remain the reviewed registry text. */
export function respond(
  character: Character,
  state: ConversationState,
  action: ConversationAction,
): ConversationState {
  const typed = action.kind === "question" ? action.text.trim().slice(0, 240) : null;
  if (typed === "") return state;
  if (typed) action = socialAction(typed) || action;
  if (action.kind === "topic") {
    const topicId = action.id;
    const topic = character.topics.find((t) => t.id === topicId);
    if (topic && socialAction(topic.question)?.kind === "introduce")
      action = { kind: "introduce" };
  }
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
          ? "There isn’t a written reply to that yet. Try asking about one of the topics below."
          : "I’m not sure about that. Would you like to talk about one of these topics instead?"),
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
        answer: state.turns.length
          ? "Hi again! What would you like to talk about?"
          : "Hi! Nice to meet you. What would you like to talk about?",
        gesture: "wave",
      },
      introduce: {
        said: "Who are you?",
        answer: character.introduction,
        gesture: "talk",
      },
      wave: {
        said: "Wave hello",
        answer: state.introduced ? "Hi again! Nice to see you." : "Hi there!",
        gesture: "wave",
      },
      thanks: {
        said: "Thanks for chatting.",
        answer: "You’re welcome! Anything else you’d like to ask?",
        gesture: "nod",
      },
      goodbye: {
        said: "See you around!",
        answer: "See you around! Enjoy the rest of your visit.",
        gesture: "wave",
      },
    } satisfies Record<
      string,
      { said: string; answer: string; gesture: Gesture }
    >;
    turn = {
      ...base,
      ...responses[action.kind],
      said: typed || responses[action.kind].said,
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
