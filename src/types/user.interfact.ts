export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface UserSession extends User {
  accessToken: string;
  refreshToken: string;
}
