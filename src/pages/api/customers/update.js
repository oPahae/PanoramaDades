import pool from '../_connect';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id, type, name, phone, email, address, country, cin, passport } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'Client ID is required' });
  }

  if (!type || !name) {
    return res.status(400).json({ message: 'Type and name are required' });
  }

  if (type !== 'person' && type !== 'agency') {
    return res.status(400).json({ message: 'Type must be either "person" or "agency"' });
  }

  try {
    const [clients] = await pool.query('SELECT * FROM Customers WHERE id = ?', [id]);
    
    if (clients.length === 0) {
      return res.status(404).json({ message: 'Client not found' });
    }

    await pool.query(
      `UPDATE Customers 
       SET type = ?, name = ?, phone = ?, email = ?, address = ?, country = ?, cin = ?, passport = ?
       WHERE id = ?`,
      [
        type,
        name,
        phone || null,
        email || null,
        address || null,
        country || null,
        cin || null,
        passport || null,
        id
      ]
    );

    res.status(200).json({ message: 'Client updated successfully' });
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ message: 'Error updating client', error: error.message });
  }
}