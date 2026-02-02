import ExcelJS from 'exceljs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { customers } = req.body;

    if (!customers || !Array.isArray(customers)) {
      return res.status(400).json({ message: 'Invalid customers data' });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Customers');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Type', key: 'type', width: 12 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Phone', key: 'phone', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Address', key: 'address', width: 40 },
      { header: 'Country', key: 'country', width: 20 },
      { header: 'CIN', key: 'cin', width: 15 },
      { header: 'Passport', key: 'passport', width: 15 },
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

    customers.forEach((customer) => {
      worksheet.addRow({
        id: customer.id,
        type: customer.type === 'agency' ? 'Agency' : 'Person',
        name: customer.name,
        phone: customer.phone || '',
        email: customer.email || '',
        address: customer.address || '',
        country: customer.country || '',
        cin: customer.cin || '',
        passport: customer.passport || '',
        dateCreation: customer.dateCreation 
          ? new Date(customer.dateCreation).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })
          : '',
      });
    });

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
            left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
            bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
            right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
          };
          cell.alignment = { vertical: 'middle' };
        });

        if (rowNumber % 2 === 0) {
          row.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFEF3C7' },
          };
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

    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=customers-${new Date().toISOString().split('T')[0]}.xlsx`);
    res.status(200).send(buffer);
  } catch (error) {
    console.error('Error generating Excel file:', error);
    res.status(500).json({ message: 'Error generating Excel file', error: error.message });
  }
}