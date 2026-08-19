export type TChatRole = 'user' | 'assistant';

export interface IChatMessage {
  id: string;
  role: TChatRole;
  content: string;
}
