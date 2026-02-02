import ExcelJS from 'exceljs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { reservations } = req.body;

    if (!reservations || !Array.isArray(reservations)) {
      return res.status(400).json({ message: 'Invalid reservations data' });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reservations');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Customer', key: 'customerName', width: 30 },
      { header: 'Customer Type', key: 'customerType', width: 15 },
      { header: 'Room', key: 'roomTitle', width: 25 },
      { header: 'Room ID', key: 'roomID', width: 10 },
      { header: 'Check-in', key: 'checkIn', width: 15 },
      { header: 'Check-out', key: 'checkOut', width: 15 },
      { header: 'Nights', key: 'nights', width: 10 },
      { header: 'Base Amount ($)', key: 'amount', width: 15 },
      { header: 'Discount (%)', key: 'discount', width: 12 },
      { header: 'TVA (%)', key: 'tva', width: 12 },
      { header: 'Total TTC ($)', key: 'totalTTC', width: 15 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Date Created', key: 'dateCreation', width: 20 },
    ];

    worksheet.getRow(1).font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD97706' },
    };
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getRow(1).height = 25;

    const calculateNights = (checkIn, checkOut) => {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      return nights > 0 ? nights : 0;
    };

    const calculateTotalTTC = (amount, discount, tva) => {
      const baseAmount = parseFloat(amount) || 0;
      const discountPercent = parseFloat(discount) || 0;
      const tvaPercent = parseFloat(tva) || 0;

      const afterDiscount = baseAmount - (baseAmount * discountPercent / 100);
      const total = afterDiscount + (afterDiscount * tvaPercent / 100);

      return total.toFixed(2);
    };

    reservations.forEach((reservation) => {
      const nights = calculateNights(reservation.checkIn, reservation.checkOut);
      const totalTTC = calculateTotalTTC(reservation.amount, reservation.discount, reservation.tva);

      worksheet.addRow({
        id: reservation.id,
        customerName: reservation.customerName,
        customerType: reservation.customerType === 'agency' ? 'Agency' : 'Person',
        roomTitle: reservation.roomTitle,
        roomID: reservation.roomID,
        checkIn: new Date(reservation.checkIn).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        checkOut: new Date(reservation.checkOut).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        nights: nights,
        amount: parseFloat(reservation.amount).toFixed(2),
        discount: reservation.discount || 0,
        tva: reservation.tva || 0,
        totalTTC: totalTTC,
        status: reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1),
        dateCreation: reservation.dateCreation 
          ? new Date(reservation.dateCreation).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          : '',
      });
    });

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        row.eachCell((cell, colNumber) => {
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
            left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
            bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
            right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          };
          cell.alignment = { vertical: 'middle' };

          if ([9, 10, 11, 12].includes(colNumber)) {
            cell.alignment = { vertical: 'middle', horizontal: 'right' };
          }
        });

        if (rowNumber % 2 === 0) {
          row.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFEF3C7' }, // amber-100
          };
        }

        const statusCell = row.getCell(13); // Colonne Status
        const status = statusCell.value?.toLowerCase();
        
        if (status === 'confirmed') {
          statusCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFDBEAFE' }, // blue-100
          };
          statusCell.font = { color: { argb: 'FF1E40AF' }, bold: true }; // blue-800
        } else if (status === 'paid') {
          statusCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFEF3C7' }, // amber-100
          };
          statusCell.font = { color: { argb: 'FF92400E' }, bold: true }; // amber-800
        } else if (status === 'finished') {
          statusCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFDCFCE7' }, // green-100
          };
          statusCell.font = { color: { argb: 'FF166534' }, bold: true }; // green-800
        } else if (status === 'canceled') {
          statusCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF3F4F6' }, // gray-100
          };
          statusCell.font = { color: { argb: 'FF6B7280' }, bold: true, strike: true }; // gray-500
        }
      }
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFD97706' } },
        left: { style: 'thin', color: { argb: 'FFD97706' } },
        bottom: { style: 'thin', color: { argb: 'FFD97706' } },
        right: { style: 'thin', color: { argb: 'FFD97706' } },
      };
    });

    const summaryRow = worksheet.addRow({});
    summaryRow.height = 30;
    
    const totalReservations = reservations.length;
    const totalRevenue = reservations.reduce((sum, res) => {
      return sum + parseFloat(calculateTotalTTC(res.amount, res.discount, res.tva));
    }, 0);

    worksheet.mergeCells(summaryRow.number, 1, summaryRow.number, 11);
    const summaryCell = worksheet.getCell(summaryRow.number, 1);
    summaryCell.value = `TOTAL: ${totalReservations} Reservations`;
    summaryCell.font = { bold: true, size: 12, color: { argb: 'FF78350F' } }; // amber-900
    summaryCell.alignment = { vertical: 'middle', horizontal: 'right' };
    summaryCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFEF3C7' }, // amber-100
    };

    const totalCell = worksheet.getCell(summaryRow.number, 12);
    totalCell.value = `$${totalRevenue.toFixed(2)}`;
    totalCell.font = { bold: true, size: 14, color: { argb: 'FF78350F' } }; // amber-900
    totalCell.alignment = { vertical: 'middle', horizontal: 'right' };
    totalCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFBBF24' }, // amber-400
    };

    summaryRow.eachCell((cell) => {
      cell.border = {
        top: { style: 'medium', color: { argb: 'FFD97706' } },
        left: { style: 'thin', color: { argb: 'FFD97706' } },
        bottom: { style: 'medium', color: { argb: 'FFD97706' } },
        right: { style: 'thin', color: { argb: 'FFD97706' } },
      };
    });

    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=reservations-${new Date().toISOString().split('T')[0]}.xlsx`);
    res.status(200).send(buffer);
  } catch (error) {
    console.error('Error generating Excel file:', error);
    res.status(500).json({ message: 'Error generating Excel file', error: error.message });
  }
}