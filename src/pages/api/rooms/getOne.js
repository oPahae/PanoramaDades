import pool from '../_connect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'Room ID is required' });
  }

  try {
    const [rooms] = await pool.query(
      `SELECT 
         id,
         status,
         title,
         category,
         description,
         priceUSD,
         priceCHF,
         beds,
         guests AS maxGuests,
         view,
         space,
         wifi,
         safe,
         rainShower,
         airConditioning,
         heater,
         hairDryer,
         image
       FROM Rooms
       WHERE id = ?`,
      [id]
    );

    if (rooms.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const room = rooms[0];

    const [images] = await pool.query(
      `SELECT url FROM Images WHERE roomID = ? ORDER BY id ASC`,
      [id]
    );

    room.gallery = images.map(img => img.url);
    res.status(200).json(room);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
}