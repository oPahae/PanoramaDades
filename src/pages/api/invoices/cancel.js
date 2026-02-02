import pool from '../_connect';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { invoiceIds } = req.body;

  if (!invoiceIds || !Array.isArray(invoiceIds) || invoiceIds.length === 0) {
    return res.status(400).json({ message: 'Invoice IDs are required' });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [invoices] = await connection.query(
      `SELECT id, status FROM Factures WHERE id IN (?)`,
      [invoiceIds]
    );

    if (invoices.length !== invoiceIds.length) {
      throw new Error('Some invoices not found');
    }

    const nonPendingInvoices = invoices.filter(inv => inv.status !== 'pending');
    if (nonPendingInvoices.length > 0) {
      throw new Error('Only pending invoices can be canceled');
    }

    await connection.query(
      `UPDATE Factures SET status = 'canceled' WHERE id IN (?)`,
      [invoiceIds]
    );

    await connection.query(
      `UPDATE Reservations r
       INNER JOIN Factures f ON r.id = f.reservationID
       SET r.status = 'canceled'
       WHERE f.id IN (?)`,
      [invoiceIds]
    );

    await connection.commit();

    res.status(200).json({ message: 'Invoices and reservations canceled successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error canceling invoices:', error);
    res.status(500).json({ message: 'Error canceling invoices', error: error.message });
  } finally {
    connection.release();
  }
}