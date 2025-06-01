import { db } from '../index.js';
import bcrypt from 'bcryptjs';

export const createUser = async (username: string, password: string) => {
  const existing = await db.user.findUnique({ where: { username } });
  if (existing) {
    throw new Error('Username is already registered');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return db.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  });
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  return bcrypt.compare(password, hashedPassword);
};

export const getUserByUsername = async (username: string) => {
  return db.user.findUnique({ where: { username } });
};

export const getUserById = async (id: number) => {
  return db.user.findUnique({ where: { id } });
};


