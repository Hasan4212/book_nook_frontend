
export interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  copies?: number;
  description?: string;
  coverImage?: string;
  name?: string;
  email?: string;
}

export interface EditFormState {
  title: string;
  author: string;
  category: string;
  copies: number;
  description: string;
}
