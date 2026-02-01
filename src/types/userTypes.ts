
//user data
export interface User {
  id?: number;
  fullName: string;
  emailOrUsername: string;
  password: string;
}

export type FavoriteItem = {
  id: string;
  name: string;
  price: number;
  image: string;
};

