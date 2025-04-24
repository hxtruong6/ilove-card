export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
  subscriptionStatus: string;
}

// Define additional properties for our user
export type AdditionalUserFields = {
  avatar?: string | null;
  lastActiveTreeId?: string | null;
  subscriptionStatus?: string;
};

export interface UserSession {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  subscriptionStatus: string;
  lastActiveTreeId: string | null;
}
