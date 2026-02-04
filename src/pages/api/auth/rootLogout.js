import { serialize } from 'cookie';

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.setHeader('Set-Cookie', serialize('RootAuthToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      expires: new Date(0),
    }));

    return res.status(200).json({ message: 'success' });
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).json({ error: `Method ${req.method} not allowed` });
}