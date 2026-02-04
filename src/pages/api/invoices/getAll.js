import pool from '../_connect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const [rows] = await pool.query(`
      SELECT 
        f.id,
        f.reservationID,
        f.code,
        f.amount as ttc,
        f.status,
        f.dateCreation,
        c.id AS customerID,
        c.name AS customerName,
        c.email AS customerEmail,
        c.phone AS customerPhone,
        c.address AS customerAddress,
        c.country AS customerCountry,
        r.roomID,
        r.checkIn,
        r.checkOut,
        r.amount,
        r.discount,
        r.tva,
        rm.title AS roomTitle
      FROM Factures f
      INNER JOIN Reservations r ON f.reservationID = r.id
      INNER JOIN Customers c ON r.customerID = c.id
      INNER JOIN Rooms rm ON r.roomID = rm.id
      ORDER BY f.dateCreation DESC
    `);
    
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ message: 'Error fetching invoices', error: error.message });
  }
}