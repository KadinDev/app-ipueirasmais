export type Weather = {
  temperatureC: number;
  description: string;
  iconName:
    | "sunny"
    | "partly-sunny"
    | "cloudy"
    | "rainy"
    | "thunderstorm"
    | "snow";
  updatedAt: string;
};
