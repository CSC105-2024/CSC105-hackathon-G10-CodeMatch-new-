import jwt from 'jsonwebtoken'

type JwtPayload = {
  userId: number
}

export const generateToken = (user: { id: number }) => {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables')
  }

  return jwt.sign({ userId: user.id }, secret, { expiresIn: '1h' })
}

export const verifyToken = (token: string): JwtPayload | null => {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables')
  }

  try {
    return jwt.verify(token, secret) as JwtPayload
  } catch (error) {
    return null
  }
}