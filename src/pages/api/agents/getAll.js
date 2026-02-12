import pool from '../_connect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const [agents] = await pool.query(
      'SELECT id, name, email, phone, dateCreation FROM Agents ORDER BY dateCreation DESC'
    );

    return res.status(200).json(agents);
  } catch (error) {
    console.error('Error fetching agents:', error);
    return res.status(500).json({ error: 'Failed to fetch agents' });
  }

}
