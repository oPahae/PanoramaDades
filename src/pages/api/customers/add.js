import pool from '../_connect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { type, name, phone, email, address, country, cin, passport } = req.body;

  if (!type || !name) {
    return res.status(400).json({ message: 'Type and name are required' });
  }

  if (type !== 'person' && type !== 'agency') {
    return res.status(400).json({ message: 'Type must be either "person" or "agency"' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO Customers (type, name, phone, email, address, country, cin, passport) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        type,
        name,
        phone || null,
        email || null,
        address || null,
        country || null,
        cin || null,
        passport || null
      ]
    );

    res.status(201).json({
      message: 'Client created successfully',
      clientId: result.insertId
    });
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ message: 'Error creating client', error: error.message });
  }
}