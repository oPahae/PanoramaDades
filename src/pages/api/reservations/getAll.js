import pool from '../_connect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const [rows] = await pool.query(`
      SELECT 
        r.id,
        r.customerID,
        r.roomID,
        r.checkIn,
        r.checkOut,
        r.amount,
        r.discount,
        r.tva,
        r.status,
        r.dateCreation,
        c.name AS customerName,
        c.type AS customerType,
        rm.title AS roomTitle
      FROM Reservations r
      INNER JOIN Customers c ON r.customerID = c.id
      INNER JOIN Rooms rm ON r.roomID = rm.id
      ORDER BY r.dateCreation DESC
    `);
    
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ message: 'Error fetching reservations', error: error.message });
  }
}