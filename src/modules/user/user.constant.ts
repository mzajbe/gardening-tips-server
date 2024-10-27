export const USER_ROLE = {
    ADMIN: 'admin',
    USER: 'user',
  } as const;

export const UserSearchableFields = ['name, email'];

// type TUserRole = keyof typeof USER_ROLE;