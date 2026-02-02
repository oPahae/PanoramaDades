import pool from '../_connect.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { filter, startDate, endDate } = req.query;

    // Déterminer la plage de dates en fonction du filtre
    let dateCondition = '';
    let dateConditionReservations = '';
    
    if (filter === 'day') {
      dateCondition = 'AND r.dateCreation >= DATE_SUB(NOW(), INTERVAL 1 DAY)';
      dateConditionReservations = 'WHERE dateCreation >= DATE_SUB(NOW(), INTERVAL 1 DAY)';
    } else if (filter === 'week') {
      dateCondition = 'AND r.dateCreation >= DATE_SUB(NOW(), INTERVAL 1 WEEK)';
      dateConditionReservations = 'WHERE dateCreation >= DATE_SUB(NOW(), INTERVAL 1 WEEK)';
    } else if (filter === 'month') {
      dateCondition = 'AND r.dateCreation >= DATE_SUB(NOW(), INTERVAL 1 MONTH)';
      dateConditionReservations = 'WHERE dateCreation >= DATE_SUB(NOW(), INTERVAL 1 MONTH)';
    } else if (filter === 'year') {
      dateCondition = 'AND r.dateCreation >= DATE_SUB(NOW(), INTERVAL 1 YEAR)';
      dateConditionReservations = 'WHERE dateCreation >= DATE_SUB(NOW(), INTERVAL 1 YEAR)';
    } else if (startDate && endDate) {
      dateCondition = `AND r.dateCreation BETWEEN '${startDate}' AND '${endDate}'`;
      dateConditionReservations = `WHERE dateCreation BETWEEN '${startDate}' AND '${endDate}'`;
    } else {
      dateConditionReservations = 'WHERE 1=1';
    }

    // 1. OVERVIEW STATISTICS
    const [overviewStats] = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM Customers) as totalCustomers,
        (SELECT COUNT(*) FROM Rooms) as totalRooms,
        (SELECT COUNT(*) FROM Reservations ${dateConditionReservations}) as totalReservations,
        (SELECT COALESCE(SUM(amount * (1-discount/100) * (1+tva/100)), 0) FROM Reservations ${dateConditionReservations}) as totalRevenue,
        (SELECT COALESCE(SUM(p.amount), 0) FROM Paiements p 
         INNER JOIN Factures f ON p.factureID = f.id 
         INNER JOIN Reservations r ON f.reservationID = r.id 
         WHERE 1=1 ${dateCondition}) as totalPaid,
        (SELECT COALESCE(SUM(f.amount), 0) FROM Factures f 
         INNER JOIN Reservations r ON f.reservationID = r.id 
         WHERE f.status = 'pending' ${dateCondition}) as totalPending
    `);

    // Calcul du taux d'occupation
    const [occupancyData] = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM Rooms WHERE status = 'occupied') as occupied,
        (SELECT COUNT(*) FROM Rooms) as total
    `);

    const occupancyRate = occupancyData[0].total > 0 
      ? Math.round((occupancyData[0].occupied / occupancyData[0].total) * 100) 
      : 0;

    // 2. ROOMS ANALYTICS

    // Distribution du statut des chambres
    // Déterminer les dates pour vérifier l'occupation
    let occupancyStartDate, occupancyEndDate;
    
    if (filter === 'day') {
      occupancyStartDate = 'DATE_SUB(NOW(), INTERVAL 1 DAY)';
      occupancyEndDate = 'NOW()';
    } else if (filter === 'week') {
      occupancyStartDate = 'DATE_SUB(NOW(), INTERVAL 1 WEEK)';
      occupancyEndDate = 'NOW()';
    } else if (filter === 'month') {
      occupancyStartDate = 'DATE_SUB(NOW(), INTERVAL 1 MONTH)';
      occupancyEndDate = 'NOW()';
    } else if (filter === 'year') {
      occupancyStartDate = 'DATE_SUB(NOW(), INTERVAL 1 YEAR)';
      occupancyEndDate = 'NOW()';
    } else if (startDate && endDate) {
      occupancyStartDate = `'${startDate}'`;
      occupancyEndDate = `'${endDate}'`;
    } else {
      // Par défaut, vérifier les réservations en cours (aujourd'hui)
      occupancyStartDate = 'CURDATE()';
      occupancyEndDate = 'CURDATE()';
    }

    const [roomStatusDistribution] = await pool.query(`
      SELECT 
        CASE 
          WHEN r.status = 'maintenance' THEN 'maintenance'
          WHEN EXISTS (
            SELECT 1 
            FROM Reservations res 
            WHERE res.roomID = r.id 
            AND res.status IN ('confirmed', 'paid')
            AND res.checkIn <= ${occupancyEndDate}
            AND res.checkOut >= ${occupancyStartDate}
          ) THEN 'occupied'
          ELSE 'available'
        END as name,
        COUNT(*) as value
      FROM Rooms r
      GROUP BY name
    `);

    // Réservations et revenus par chambre
    const [roomStats] = await pool.query(`
      SELECT 
        r.number as roomNumber,
        r.title as roomTitle,
        COUNT(res.id) as reservations,
        COALESCE(SUM(res.amount), 0) as revenue
      FROM Rooms r
      LEFT JOIN Reservations res ON r.id = res.roomID ${dateCondition ? dateCondition.replace('r.', 'res.') : ''}
      GROUP BY r.id, r.number, r.title
      ORDER BY r.number
    `);

    // 3. FINANCIAL ANALYTICS

    // Somme des factures par statut
    const [invoicesByStatus] = await pool.query(`
      SELECT 
        f.status as name,
        COUNT(*) as value
      FROM Factures f
      INNER JOIN Reservations r ON f.reservationID = r.id
      WHERE 1=1 ${dateCondition}
      GROUP BY f.status
    `);

    const [invoiceSums] = await pool.query(`
      SELECT 
        COALESCE(SUM(CASE WHEN f.status = 'paid' THEN f.amount ELSE 0 END), 0) as paid,
        COALESCE(SUM(CASE WHEN f.status = 'pending' THEN f.amount ELSE 0 END), 0) as pending,
        COALESCE(SUM(CASE WHEN f.status = 'canceled' THEN f.amount ELSE 0 END), 0) as canceled
      FROM Factures f
      INNER JOIN Reservations r ON f.reservationID = r.id
      WHERE 1=1 ${dateCondition}
    `);

    // Taux de paiement
    const totalInvoices = Number(invoiceSums[0].paid) + Number(invoiceSums[0].pending);
    const paymentRate = totalInvoices > 0 
      ? Math.round((invoiceSums[0].paid / totalInvoices) * 100) 
      : 0;

    // Réservations par statut
    const [reservationsByStatus] = await pool.query(`
      SELECT 
        status as name,
        COUNT(*) as value
      FROM Reservations
      ${dateConditionReservations}
      GROUP BY status
    `);

    // Revenus au fil du temps
    let revenueOverTimeQuery = '';
    if (filter === 'day') {
      revenueOverTimeQuery = `
        SELECT 
          DATE_FORMAT(dateCreation, '%H:00') as date,
          COALESCE(SUM(amount), 0) as revenue
        FROM Reservations
        WHERE dateCreation >= DATE_SUB(NOW(), INTERVAL 1 DAY)
        GROUP BY DATE_FORMAT(dateCreation, '%Y-%m-%d %H')
        ORDER BY dateCreation
      `;
    } else if (filter === 'week') {
      revenueOverTimeQuery = `
        SELECT 
          DATE_FORMAT(dateCreation, '%a') as date,
          COALESCE(SUM(amount), 0) as revenue
        FROM Reservations
        WHERE dateCreation >= DATE_SUB(NOW(), INTERVAL 1 WEEK)
        GROUP BY DATE(dateCreation)
        ORDER BY dateCreation
      `;
    } else if (filter === 'month') {
      revenueOverTimeQuery = `
        SELECT 
          DATE_FORMAT(dateCreation, '%d %b') as date,
          COALESCE(SUM(amount), 0) as revenue
        FROM Reservations
        WHERE dateCreation >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
        GROUP BY DATE(dateCreation)
        ORDER BY dateCreation
      `;
    } else if (filter === 'year') {
      revenueOverTimeQuery = `
        SELECT 
          DATE_FORMAT(dateCreation, '%b') as date,
          COALESCE(SUM(amount), 0) as revenue
        FROM Reservations
        WHERE dateCreation >= DATE_SUB(NOW(), INTERVAL 1 YEAR)
        GROUP BY YEAR(dateCreation), MONTH(dateCreation)
        ORDER BY dateCreation
      `;
    } else if (startDate && endDate) {
      revenueOverTimeQuery = `
        SELECT 
          DATE_FORMAT(dateCreation, '%d %b') as date,
          COALESCE(SUM(amount), 0) as revenue
        FROM Reservations
        WHERE dateCreation BETWEEN '${startDate}' AND '${endDate}'
        GROUP BY DATE(dateCreation)
        ORDER BY dateCreation
      `;
    } else {
      // All time - par mois
      revenueOverTimeQuery = `
        SELECT 
          DATE_FORMAT(dateCreation, '%b %Y') as date,
          COALESCE(SUM(amount), 0) as revenue
        FROM Reservations
        GROUP BY YEAR(dateCreation), MONTH(dateCreation)
        ORDER BY dateCreation
        LIMIT 12
      `;
    }

    const [revenueOverTime] = await pool.query(revenueOverTimeQuery);

    // 4. CUSTOMERS ANALYTICS

    // Top clients avec détails complets
    const [customerDetails] = await pool.query(`
      SELECT 
        c.id,
        c.name,
        c.type,
        c.email,
        c.phone,
        COUNT(r.id) as totalReservations,
        COALESCE(SUM(CASE WHEN f.status = 'paid' THEN p.amount ELSE 0 END), 0) as totalPaid,
        COALESCE(SUM(CASE WHEN f.status = 'pending' THEN f.amount ELSE 0 END), 0) as totalPending
      FROM Customers c
      LEFT JOIN Reservations r ON c.id = r.customerID ${dateCondition ? dateCondition.replace('r.', 'r.') : ''}
      LEFT JOIN Factures f ON r.id = f.reservationID
      LEFT JOIN Paiements p ON f.id = p.factureID
      GROUP BY c.id, c.name, c.type, c.email, c.phone
      HAVING totalReservations > 0
      ORDER BY totalReservations DESC
    `);

    // Construire la réponse
    const response = {
      overview: {
        totalCustomers: overviewStats[0].totalCustomers,
        totalRooms: overviewStats[0].totalRooms,
        occupancyRate: occupancyRate,
        totalReservations: overviewStats[0].totalReservations,
        totalRevenue: parseFloat(overviewStats[0].totalRevenue),
        totalPaid: parseFloat(overviewStats[0].totalPaid),
        totalPending: parseFloat(overviewStats[0].totalPending)
      },
      rooms: {
        statusDistribution: roomStatusDistribution.map(item => ({
          name: item.name,
          value: item.value
        })),
        byRoom: roomStats.map(room => ({
          roomNumber: room.roomNumber,
          roomTitle: room.roomTitle,
          reservations: room.reservations,
          revenue: parseFloat(room.revenue)
        }))
      },
      financial: {
        invoicesPaid: parseFloat(invoiceSums[0].paid),
        invoicesPending: parseFloat(invoiceSums[0].pending),
        invoicesCanceled: parseFloat(invoiceSums[0].canceled),
        paymentRate: paymentRate,
        revenueOverTime: revenueOverTime.map(item => ({
          date: item.date,
          revenue: parseFloat(item.revenue)
        })),
        reservationsByStatus: reservationsByStatus.map(item => ({
          name: item.name,
          value: item.value
        })),
        invoicesByStatus: invoicesByStatus.map(item => ({
          name: item.name,
          value: item.value
        }))
      },
      customers: {
        total: customerDetails.length,
        details: customerDetails.map(customer => ({
          id: customer.id,
          name: customer.name,
          type: customer.type,
          email: customer.email,
          phone: customer.phone,
          totalReservations: customer.totalReservations,
          totalPaid: parseFloat(customer.totalPaid),
          totalPending: parseFloat(customer.totalPending)
        }))
      }
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ 
      message: 'Failed to fetch statistics',
      error: error.message 
    });
  }
}