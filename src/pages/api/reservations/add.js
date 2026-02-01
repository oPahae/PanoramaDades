import pool from '../_connect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { customerID, roomID, checkIn, checkOut, amount, discount, tva } = req.body;
  console.log(amount)
  console.log(discount)
  console.log(tva)

  if (!customerID || !roomID || !checkIn || !checkOut || !amount) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    if (new Date(checkOut) <= new Date(checkIn)) {
      throw new Error('Check-out date must be after check-in date');
    }

    const [conflictingReservations] = await connection.query(
      `SELECT id FROM Reservations 
       WHERE roomID = ? 
       AND status NOT IN ('canceled', 'finished')
       AND (
         (checkIn <= ? AND checkOut > ?) OR
         (checkIn < ? AND checkOut >= ?) OR
         (checkIn >= ? AND checkOut <= ?)
       )`,
      [roomID, checkIn, checkIn, checkOut, checkOut, checkIn, checkOut]
    );

    if (conflictingReservations.length > 0) {
      return res.status(400).json({ message: 'This room is already reserved for this date' });
    }

    const [reservationResult] = await connection.query(
      `INSERT INTO Reservations (customerID, roomID, checkIn, checkOut, amount, discount, tva, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmed')`,
      [customerID, roomID, checkIn, checkOut, amount, discount || 0, tva || 0]
    );

    const reservationId = reservationResult.insertId;

    const discountAmount = amount * ((discount || 0) / 100);
    const afterDiscount = amount - discountAmount;
    const tvaAmount = afterDiscount * ((tva || 0) / 100);
    const totalAmount = afterDiscount + tvaAmount;

    const factureCode = `INV-${Date.now()}-${reservationId}`;

    await connection.query(
      `INSERT INTO Factures (reservationID, code, amount, status) 
       VALUES (?, ?, ?, 'pending')`,
      [reservationId, factureCode, totalAmount]
    );

    await connection.commit();

    res.status(201).json({ 
      message: 'Reservation and invoice created successfully',
      reservationId,
      factureCode
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error adding reservation:', error);
    res.status(500).json({ message: 'Error adding reservation', error: error.message });
  } finally {
    connection.release();
  }
}
