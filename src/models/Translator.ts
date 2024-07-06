export type Language = "english" | "darija";

export interface ITranslate {
  source: string;
  destination: string;
  verified?: boolean;
  alternatives?: {
    alternative: string;
    verified: boolean;
  }[];
}
