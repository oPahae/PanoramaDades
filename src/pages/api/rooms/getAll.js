import pool from '../_connect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const [rooms] = await pool.query(`
      SELECT 
        r.id,
        r.status,
        r.image,
        r.title,
        r.category,
        r.description,
        r.priceUSD,
        r.priceCHF,
        r.beds,
        r.guests,
        r.view
      FROM Rooms r
      ORDER BY r.id ASC
    `);

    res.status(200).json(rooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
}