export const USER_ROLE = {
    
    admin : 'admin',
    user : 'user'

} as const ;

export const UserSearchableFields = ['name, email'];

// type TUserRole = keyof typeof USER_ROLE;