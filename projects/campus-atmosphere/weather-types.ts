export type WeatherObservation = {
  provider: string;
  station: string;
  observedAt: string;
  condition: string;
  weather: "neutral" | "clear" | "cloudy" | "overcast" | "rain" | "snow" | "fog";
  windKph: number;
  intensity: number;
  fog?: boolean;
};

export type WeatherReport = {
  observation: WeatherObservation | null;
  cached: boolean;
  nextCheckAt: string;
};
