export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
  subscriptionStatus: string;
}

export interface UserSession {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  subscriptionStatus: string;
}
