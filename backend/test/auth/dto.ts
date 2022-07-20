export const successRegistrationDto = {
    name: 'test',
    email: 'test12345@gmail.com',
    gender: 'Male',
    dob: '20-12-2000',
    password: 'admin12345',
    preference: 'All'
}

export const incorrectRegistrationDto = {
    name: 'test',
    email: 'tevfgvfdg@tre.com',
    gender: 'Male',
    dob: '20122000',
    password: 'admin12345',
    preference: 'All',
}

export const successLoginDto = {
    email: 'test12345@gmail.com',
    password: 'admin12345',
}

export const incorrectLoginDto = {
    email: 'test12345@gmail.com',
    password: 'admin123',
}

export const loginWithNotExistUserDto = {
    email: 'test@gmail.com',
    password: 'admin123',
}
