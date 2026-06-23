export const USER_ROLE = {
  ADMIN: "admin",
  user: "user",
} as const;

export const UserSearchableFields = [
  "name",
  "email",
  "role",
  // "status",
];

// type TUserRole = keyof typeof USER_ROLE;
