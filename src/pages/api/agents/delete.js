import pool from '../_connect';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.body;

  // Validation
  if (!id) {
    return res.status(400).json({ error: 'Agent ID is required' });
  }

  try {
    // Vérifier si l'agent existe
    const [existingAgents] = await pool.query(
      'SELECT id FROM agents WHERE id = ?',
      [id]
    );

    if (existingAgents.length === 0) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    // Supprimer l'agent
    await pool.query('DELETE FROM agents WHERE id = ?', [id]);

    return res.status(200).json({
      success: true,
      message: 'Agent deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting agent:', error);
    
    // Vérifier si l'erreur est due à une contrainte de clé étrangère
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({ 
        error: 'Cannot delete this agent because they have associated records in the system' 
      });
    }
    
    return res.status(500).json({ error: 'Failed to delete agent' });
  }
}