export interface IUser {
  id?: number;
  email: string;
  name: string;
  bio?: string;
  role?: string;
  firebase_token: string;
  avatar?: string;
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

export function generateAnonymousUsername(): string {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  return `Member#${randomNumber}`;
}

export function isAnonymousUsername(name: string): boolean {
  const anonymousUsernamePattern = /^Member#\d{4}$/;
  return anonymousUsernamePattern.test(name);
}
