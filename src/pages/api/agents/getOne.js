import pool from '../_connect';
import { verifyAuth } from '@/middlewares/agentAuth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const agent = verifyAuth(req, res);
    
    if (!agent) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const [agents] = await pool.execute(
      'SELECT id, name, email, phone, dateCreation FROM Agents WHERE id = ?',
      [agent.id]
    );

    if (agents.length === 0) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    const agentData = agents[0];

    return res.status(200).json({ 
      agent: {
        id: agentData.id,
        name: agentData.name,
        email: agentData.email,
        phone: agentData.phone,
        dateCreation: agentData.dateCreation
      }
    });

  } catch (error) {
    console.error('Get agent error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}