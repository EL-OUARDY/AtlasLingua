export interface IUser {
  id?: number;
  email: string;
  name: string;
  bio?: string;
  role?: string;
  firebase_token: string;
}

/**
 * Defines the available user roles in the system
 * @readonly
 */
export const USER_ROLES = {
  MEMBER: "MEMBER",
  CONTRIBUTOR: "CONTRIBUTOR",
  ADMIN: "ADMIN",
} as const;

// Type for type-safety
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const ANONYMOUS_NAME = "No Name";
