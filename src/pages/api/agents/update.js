import pool from '../_connect';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, name, phone } = req.body;

  // Validation
  if (!id) {
    return res.status(400).json({ error: 'Agent ID is required' });
  }

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const [existingAgents] = await pool.query(
      'SELECT id FROM agents WHERE id = ?',
      [id]
    );

    if (existingAgents.length === 0) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    await pool.query(
      'UPDATE agents SET name = ?, phone = ? WHERE id = ?',
      [name.trim(), phone?.trim() || null, id]
    );

    return res.status(200).json({
      success: true,
      message: 'Agent updated successfully'
    });
  } catch (error) {
    console.error('Error updating agent:', error);
    return res.status(500).json({ error: 'Failed to update agent' });
  }
}