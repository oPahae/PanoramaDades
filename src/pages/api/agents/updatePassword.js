import pool from '../_connect';
import bcrypt from 'bcryptjs';
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

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const [agents] = await pool.execute(
      'SELECT id, password FROM Agents WHERE id = ?',
      [agent.id]
    );

    if (agents.length === 0) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    const agentData = agents[0];

    const isPasswordValid = await bcrypt.compare(currentPassword, agentData.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const [result] = await pool.execute(
      'UPDATE Agents SET password = ? WHERE id = ?',
      [hashedPassword, agent.id]
    );

    if (result.affectedRows === 0) {
      return res.status(500).json({ message: 'Failed to update password' });
    }

    return res.status(200).json({ 
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Password update error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}