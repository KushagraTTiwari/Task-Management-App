import bcrypt from 'bcryptjs';

export function generateHashPassword (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

export function comparePassword (password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword);
}