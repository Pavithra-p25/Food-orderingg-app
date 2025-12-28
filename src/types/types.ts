//restaurant menu 
export interface MenuItem {
  id: number;
  name: string;
  price: number;
}

//restaurant data
export interface Restaurant {
  id: number;
  name: string;
  category: string;
  rating: number;
  image: string;
  menu?: MenuItem[];
}

//user data
export interface User {
  id?: number;
  fullName: string;
  emailOrUsername: string;
  password: string;
}