import pool from '../_connect';
import { verifyAuth } from '@/middlewares/agentAuth';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const agent = verifyAuth(req, res);
    
    if (!agent) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { name, email, phone } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Name is required' });
    }

    if (email && email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }
    }

    const [result] = await pool.execute(
      'UPDATE Agents SET name = ?, email = ?, phone = ? WHERE id = ?',
      [name.trim(), email?.trim() || null, phone?.trim() || null, agent.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    return res.status(200).json({ 
      message: 'Profile updated successfully',
      agent: {
        id: agent.id,
        name: name.trim(),
        email: email?.trim() || null,
        phone: phone?.trim() || null
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}