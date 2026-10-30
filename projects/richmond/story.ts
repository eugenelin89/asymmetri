// SPDX-License-Identifier: MIT — all businesses used for interaction and all people are fictional.
import type { Mission } from "./types";
export const missions: Mission[] = [
  {
    id: "first-day",
    title: "First Day in Richmond",
    food: "Taiwanese bento",
    pickup: "brighouse",
    destination: "minoru",
    customer: "Mei",
    description:
      "A short first shift: park, meet the kitchen team, collect the labelled bag and find Mei by the park.",
  },
  {
    id: "dim-sum",
    title: "Dim Sum Dash",
    food: "Dim sum",
    pickup: "alexandra",
    destination: "garden-city",
    customer: "Daniel",
    description: "From Alexandra Road to a fictional apartment-lobby customer.",
  },
  {
    id: "steveston",
    title: "Steveston Seafood Run",
    food: "Fish and chips",
    pickup: "steveston",
    destination: "garry-point",
    customer: "Avery",
    description:
      "Collect a fresh lunch in the village and walk it to the waterfront picnic meeting point.",
  },
  {
    id: "terra-nova",
    title: "Terra Nova Picnic",
    food: "Sushi picnic",
    pickup: "aberdeen",
    destination: "terra-nova",
    customer: "Jia",
    description: "A longer westbound delivery to the park.",
  },
  {
    id: "bridgeport",
    title: "Bridgeport Rush",
    food: "Pizza",
    pickup: "lansdowne",
    destination: "ikea",
    customer: "Priya",
    description:
      "Meet a fictional warehouse worker by the IKEA/Jacombs commercial district.",
  },
  {
    id: "mall",
    title: "Richmond Centre Shopping Break",
    food: "Bubble tea",
    pickup: "richmond-centre",
    destination: "city-hall",
    customer: "Sam",
    description:
      "Earn a delivery fee, then return to the mall and buy your insulated bag.",
  },
  {
    id: "terminal",
    title: "Terminal Takeout",
    food: "Noodles",
    pickup: "alexandra",
    destination: "yvr",
    customer: "Evelyn",
    description:
      "Drive to Sea Island, park and bring dinner to the terminal arrivals meeting point.",
  },
  {
    id: "airport-lunch",
    title: "Airport Lunch Run",
    food: "Burgers",
    pickup: "yvr",
    destination: "airport-office",
    customer: "Morgan",
    description:
      "Collect at the terminal café and deliver to fictional staff inside the airport operations office.",
  },
];
export const community = [
  ["Mei", "你好！今天辛苦了。 Thanks for bringing lunch!"],
  ["Jun", "唔該晒！ Thank you. Have a good shift!"],
  ["Lena", "My grandparents and I are taking a walk after lunch."],
  ["Arjun", "The park is a lovely place for a break."],
  ["Grace", "The next order is packed and labelled. Check the order number."],
  ["Wei", "歡迎！ Welcome. The pickup counter is just ahead."],
  ["Rosa", "A cup of tea before my next flight."],
  ["Noah", "I left you a clear meeting point. No need to rush."],
];
export const encounterText = {
  pickpocket: "Someone is reaching for your pocket. Move away or seek help.",
  scam: "A stranger asks you to hand over an order without its matching code. Keep your bag and check the real meeting point.",
  robbery: "Someone demands cash. There is room to leave; help is available.",
  breakin: "A stranger is trying your parked car door. Return or seek help.",
  hazard:
    "A loose load has scattered debris ahead. Slow down and keep your distance.",
} as const;
