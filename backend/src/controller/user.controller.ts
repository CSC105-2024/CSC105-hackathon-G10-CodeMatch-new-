import type { Context } from 'hono'
import * as userModel from '../model/user.model.js'
import { setCookie } from 'hono/cookie'
import { generateToken } from '../utils/token.js'

const handleSignup = async (c: Context) => {
  try {
    const body = await c.req.json<{ username: string; password: string }>()
    const { username, password } = body

    if (!username || !password) {
      return c.json({ success: false, msg: 'Missing username or password' }, 400)
    }

    const user = await userModel.createUser(username, password)
    const token = generateToken(user)

    setCookie(c, 'token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      path: '/',
      maxAge: 60 * 60,
    })

    return c.json({
      success: true,
      data: { id: user.id, username: user.username },
      msg: 'User created successfully',
    }, 201)
  } catch (e) {
    if (e instanceof Error && e.message.includes('already')) {
      return c.json({ success: false, msg: 'Username already registered' }, 409)
    }
    return c.json({ success: false, msg: `Internal Server Error: ${e}` }, 500)
  }
}

const handleLogin = async (c: Context) => {
  try {
    const body = await c.req.json<{ username: string; password: string; remember?: boolean }>()
    const { username, password, remember } = body

    if (!username || !password) {
      return c.json({ success: false, msg: 'Missing username or password' }, 400)
    }

    const user = await userModel.getUserByUsername(username)
    if (!user) {
      return c.json({ success: false, msg: '🚫 User not found' }, 404)
    }

    const isValid = await userModel.comparePassword(password, user.password)
    if (!isValid) {
      return c.json({ success: false, msg: '❌ Invalid password' }, 401)
    }

    const token = generateToken(user)
    const maxAge = remember ? 60 * 60 * 24 * 7 : 60 * 60

    setCookie(c, 'token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      path: '/',
      maxAge,
    })

    return c.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
      },
      msg: 'Login successful',
    })
  } catch (e) {
    return c.json({ success: false, msg: `Internal Server Error: ${e}` }, 500)
  }
}

const handleLogout = async (c: Context) => {
  c.header(
    'Set-Cookie',
    'token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0'
  )
  return c.json({ success: true, msg: 'Logged out successfully' })
}

const getMe = async (c: Context) => {
  const userId = c.get('userId');
  if (!userId) {
    return c.json({ success: false, msg: 'Unauthorized' }, 401);
  }

  const user = await userModel.getUserById(userId);
  if (!user) {
    return c.json({ success: false, msg: 'User not found' }, 404);
  }

  return c.json({
    success: true,
    data: {
      id: user.id,
      username: user.username,
    },
  });
};


export {
  handleSignup,
  handleLogin,
  handleLogout,
  getMe,
}
