import { useState, useEffect, useRef } from 'react';
import { Eye, CheckCircle, XCircle, Download, Printer, Search, Filter, ChevronLeft, ChevronRight, AlertCircle, X, Coins } from 'lucide-react';
import { verifyAuth } from '@/middlewares/rootAuth';

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [previewModal, setPreviewModal] = useState(false);
  const [validateModal, setValidateModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [paymentData, setPaymentData] = useState({
    mode: 'cash',
    amount: '',
    note: ''
  });

  useEffect(() => {
    const sum = selectedInvoices.reduce((s, inv) => {
      const afterDiscount = inv.amount * (1 - (inv.discount || 0) / 100);
      const total = afterDiscount * (1 + (inv.tva || 0) / 100);
      return s + total;
    }, 0);
    setPaymentData({
      ...paymentData,
      amount: selectedInvoices.length > 0 ? sum.toFixed(2) : '',
    });
  }, [selectedInvoices]);

  const previewModalRef = useRef(null);
  const validateModalRef = useRef(null);
  const cancelModalRef = useRef(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    applyFilters();
  }, [invoices, statusFilter, searchQuery, sortOrder]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (previewModal && previewModalRef.current && !previewModalRef.current.contains(event.target)) {
        setPreviewModal(false);
        setPdfUrl(null);
      }
      if (validateModal && validateModalRef.current && !validateModalRef.current.contains(event.target)) {
        setValidateModal(false);
        resetPaymentData();
      }
      if (cancelModal && cancelModalRef.current && !cancelModalRef.current.contains(event.target)) {
        setCancelModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [previewModal, validateModal, cancelModal]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/invoices/getAll');
      if (!response.ok) throw new Error('Failed to fetch invoices');
      const data = await response.json();
      console.log(data)
      setInvoices(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...invoices];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(inv => inv.status === statusFilter);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(inv =>
        inv.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.id.toString().includes(searchQuery)
      );
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.dateCreation);
      const dateB = new Date(b.dateCreation);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    setFilteredInvoices(filtered);
  };

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInvoices = filteredInvoices.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleSelectInvoice = (invoice) => {
    const isSelected = selectedInvoices.some(inv => inv.id === invoice.id);

    if (isSelected) {
      setSelectedInvoices(selectedInvoices.filter(inv => inv.id !== invoice.id));
    } else {
      // Vérifier si un client différent est déjà sélectionné
      if (selectedInvoices.length > 0 && selectedInvoices[0].customerID !== invoice.customerID) {
        alert('You can only select invoices from the same customer');
        return;
      }
      setSelectedInvoices([...selectedInvoices, invoice]);
    }
  };

  const handlePreview = async () => {
    if (selectedInvoices.length === 0) {
      alert('Please select at least one invoice');
      return;
    }

    try {
      setProcessing(true);
      const html = generateInvoiceHTML();

      const response = await fetch('/api/invoices/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html }),
      });

      if (!response.ok) throw new Error('Failed to generate PDF');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setPreviewModal(true);
    } catch (err) {
      alert('Error generating preview: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleValidate = async (e) => {
    e.preventDefault();

    if (!paymentData.amount || parseFloat(paymentData.amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      setProcessing(true);
      const response = await fetch('/api/invoices/validate', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceIds: selectedInvoices.map(inv => inv.id),
          payment: paymentData
        }),
      });

      if (!response.ok) throw new Error('Failed to validate invoices');

      await fetchInvoices();
      setValidateModal(false);
      setSelectedInvoices([]);
      resetPaymentData();
    } catch (err) {
      alert('Error validating invoices: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = async () => {
    try {
      setProcessing(true);
      const response = await fetch('/api/invoices/cancel', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceIds: selectedInvoices.map(inv => inv.id) }),
      });

      if (!response.ok) throw new Error('Failed to cancel invoices');

      await fetchInvoices();
      setCancelModal(false);
      setSelectedInvoices([]);
    } catch (err) {
      alert('Error canceling invoices: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (selectedInvoices.length === 0) {
      alert('Please select at least one invoice');
      return;
    }

    try {
      setProcessing(true);
      const html = generateInvoiceHTML();

      const response = await fetch('/api/invoices/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html }),
      });

      if (!response.ok) throw new Error('Failed to generate PDF');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${selectedInvoices[0].code}-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Error downloading invoice: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handlePrint = async () => {
    if (selectedInvoices.length === 0) {
      alert('Please select at least one invoice');
      return;
    }

    const html = generateInvoiceHTML();
    const printWindow = window.open('', '_blank');
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const resetPaymentData = () => {
    setPaymentData({
      mode: 'cash',
      amount: '',
      note: ''
    });
  };

  const numberToWords = (num) => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

    if (num === 0) return 'Zero';

    const convert = (n) => {
      if (n < 10) return ones[n];
      if (n < 20) return teens[n - 10];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
      if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convert(n % 100) : '');
      if (n < 1000000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
      return convert(Math.floor(n / 1000000)) + ' Million' + (n % 1000000 ? ' ' + convert(n % 1000000) : '');
    };

    const dollars = Math.floor(num);
    const cents = Math.round((num - dollars) * 100);

    let result = convert(dollars) + ' Dollar' + (dollars !== 1 ? 's' : '');
    if (cents > 0) {
      result += ' and ' + convert(cents) + ' Cent' + (cents !== 1 ? 's' : '');
    }
    return result;
  };

  // ENG :
  // const generateInvoiceHTML = () => {
  //   const totalHT = selectedInvoices.reduce((sum, inv) => {
  //     const amountHT = inv.amount * (1 - inv.discount / 100);
  //     return sum + amountHT;
  //   }, 0);

  //   const totalTVA = selectedInvoices.reduce((sum, inv) => {
  //     const amountHT = inv.amount * (1 - inv.discount / 100);
  //     const tvaAmount = amountHT * (inv.tva / 100);
  //     return sum + tvaAmount;
  //   }, 0);

  //   const totalTTC = totalHT + totalTVA;

  //   const getStatusEmoji = (status) => {
  //     switch (status?.toLowerCase()) {
  //       case 'paid': return '✅';
  //       case 'pending': return '⏳';
  //       case 'canceled': return '❌';
  //       default: return '⏳';
  //     }
  //   };

  //   return `
  // <!DOCTYPE html>
  // <html>
  // <head>
  //   <meta charset="UTF-8">
  //   <style>
  //     * { margin: 0; padding: 0; box-sizing: border-box; }
  //     body { 
  //       font-family: 'Helvetica', 'Arial', sans-serif; 
  //       padding: 20px;
  //       color: #333;
  //       line-height: 1.6;
  //       max-width: 1000px;
  //       margin: 0 auto;
  //     }

  //     .logo-section {
  //       text-align: center;
  //       margin-bottom: 14px;
  //     }

  //     .logo-section img {
  //       height: 60px;
  //     }

  //     .logo-section h1 {
  //       font-size: 20px;
  //       color: #1e3a8a;
  //       margin-bottom: 15px;
  //       font-weight: 600;
  //     }

  //     .logo-section .divider {
  //       width: 100%;
  //       height: 3px;
  //       background: #1e3a8a;
  //       margin-top: 10px;
  //     }

  //     .invoice-info {
  //       display: flex;
  //       justify-content: space-between;
  //       margin: 8px 0;
  //       font-size: 14px;
  //     }

  //     .invoice-left p {
  //       margin: 5px 0;
  //       color: #4b5563;
  //     }

  //     .invoice-right {
  //       text-align: right;
  //     }

  //     .status-line {
  //       font-size: 16px;
  //       font-weight: 500;
  //     }

  //     .section-header {
  //       background: #1e3a8a;
  //       color: white;
  //       padding: 12px 20px;
  //       font-size: 16px;
  //       font-weight: 600;
  //       margin-top: 0;
  //       margin-bottom: 0;
  //     }

  //     .info-box {
  //       border: 1px solid #d1d5db;
  //       padding: 8px;
  //       margin-bottom: 20px;
  //       margin-top: 4px;
  //     }

  //     .info-box p {
  //       font-size: 14px;
  //       color: #4b5563;
  //     }

  //     .info-box .name {
  //       color: #1e3a8a;
  //       font-weight: 600;
  //       font-size: 16px;
  //       margin-bottom: 4px;
  //     }

  //     table {
  //       width: 100%;
  //       border-collapse: collapse;
  //       margin: 30px 0;
  //       overflow: hidden;
  //       border-radius: 8px;
  //     }

  //     thead {
  //       background: #1e3a8a;
  //       color: white;
  //     }

  //     th {
  //       padding: 14px 10px;
  //       text-align: left;
  //       font-size: 13px;
  //       font-weight: 600;
  //       text-transform: uppercase;
  //       letter-spacing: 0.5px;
  //     }

  //     td {
  //       padding: 12px 10px;
  //       border-bottom: 1px solid #e5e7eb;
  //       font-size: 13px;
  //       color: #374151;
  //     }

  //     tbody tr:last-child td {
  //       border-bottom: none;
  //     }

  //     tbody tr {
  //       background: white;
  //     }

  //     tbody tr:hover {
  //       background: #f9fafb;
  //     }

  //     .text-right { text-align: right; }
  //     .text-center { text-align: center; }

  //     .totals-section {
  //       display: flex;
  //       flex-direction: column;
  //       align-items: flex-end;
  //     }

  //     .total-row {
  //       display: flex;
  //       justify-content: space-between;
  //       width: 260px;
  //       font-size: 13px;
  //       color: #374151;
  //     }

  //     .total-row.final {
  //       border-top: 2px solid #1e3a8a;
  //       margin-top: 2px;
  //       font-size: 13px;
  //       font-weight: bold;
  //       color: #1e3a8a;
  //     }

  //     .amount-words {
  //       background: rgb(235, 213, 52, 0.2);
  //       padding: 8px;
  //       border-radius: 8px;
  //       font-style: italic;
  //       color: #374151;
  //       text-align: start;
  //       font-size: 12px;
  //       border-left: 4px solid orange;
  //       margin-block: 14px;
  //     }

  //     .footer {
  //       margin-top: 10px;
  //       border-top: 2px solid #e5e7eb;
  //       text-align: center;
  //       font-size: 10px;
  //       color: #9ca3af;
  //     }

  //     .footer p {
  //       margin: 4px 0;
  //     }
  //   </style>
  // </head>
  // <body>
  //   <!-- Logo and Title -->
  //   <div class="logo-section">
  //     <img src="{{LOGO_BASE64}}" alt="Logo">
  //     <h1>Invoice</h1>
  //     <div class="divider"></div>
  //   </div>

  //   <!-- Invoice Info -->
  //   <div class="invoice-info">
  //     <div class="invoice-left">
  //       <p><strong>${selectedInvoices[0]?.code || ''}</strong></p>
  //       <p>Gorges Dades, ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
  //     </div>
  //     <div class="invoice-right">
  //       <p class="status-line"><strong>Status:</strong> ${getStatusEmoji(selectedInvoices[0]?.status)} ${selectedInvoices[0]?.status || 'Pending'}</p>
  //     </div>
  //   </div>

  //   <!-- Customer Section -->
  //   <div class="section-header">Customer</div>
  //   <div class="info-box">
  //     <p class="name">${selectedInvoices[0]?.customerName || 'N/A'}</p>
  //     <p>${selectedInvoices[0]?.customerEmail || 'N/A'}</p>
  //     <p>${selectedInvoices[0]?.customerPhone || 'N/A'}</p>
  //     <p>${selectedInvoices[0]?.customerAddress || 'N/A'}</p>
  //     <p>${selectedInvoices[0]?.customerCountry || 'N/A'}</p>
  //   </div>

  //   <!-- Supplier Section -->
  //   <div class="section-header">Supplier</div>
  //   <div class="info-box">
  //     <p class="name">Panorama Dades</p>
  //     <p>Georges Dades, Ait ibriren</p>
  //     <p>Boumalne dades 45150</p>
  //     <p>0668762022</p>
  //     <p>Auberge-panorama@hotmail.fr</p>
  //   </div>

  //   <!-- Invoice Table -->
  //   <table>
  //     <thead>
  //       <tr>
  //         <th>Designation</th>
  //         <th class="text-right">Unit Price</th>
  //         <th class="text-center">Unit</th>
  //         <th class="text-center">Quantity</th>
  //         <th class="text-right">Amount</th>
  //         <th class="text-right">Discount</th>
  //         <th class="text-right">Amount HT</th>
  //       </tr>
  //     </thead>
  //     <tbody>
  //       ${selectedInvoices.map(inv => {
  //     const checkIn = new Date(inv.checkIn);
  //     const checkOut = new Date(inv.checkOut);
  //     const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  //     const unitPrice = inv.amount / nights;
  //     const amountHT = inv.amount * (1 - inv.discount / 100);

  //     return `
  //           <tr>
  //             <td>
  //               <strong>${inv.roomTitle}</strong><br>
  //             </td>
  //             <td class="text-right">${unitPrice.toFixed(2)} MAD</td>
  //             <td class="text-center">U</td>
  //             <td class="text-center">${nights}</td>
  //             <td class="text-right">${parseFloat(inv.amount).toFixed(2)} MAD</td>
  //             <td class="text-right">${inv.discount}%</td>
  //             <td class="text-right">${amountHT.toFixed(2)} MAD</td>
  //           </tr>
  //         `;
  //   }).join('')}
  //     </tbody>
  //   </table>

  //   <!-- Totals -->
  //   <div class="totals-section">
  //     <div class="total-row">
  //       <span>Total HT:</span>
  //       <span>${totalHT.toFixed(2)} MAD</span>
  //     </div>
  //     <div class="total-row">
  //       <span>TVA:</span>
  //       <span>${totalTVA.toFixed(2)} MAD</span>
  //     </div>
  //     <div class="total-row final">
  //       <span>TOTAL TTC TO PAY:</span>
  //       <span>${totalTTC.toFixed(2)} MAD</span>
  //     </div>
  //   </div>

  //   <!-- Amount in Words -->
  //   <div class="amount-words">
  //     <strong>Amount in words:</strong> ${numberToWords(totalTTC)}
  //   </div>

  //   <!-- Footer -->
  //   <div class="footer">
  //     <p>Thank you for your business!</p>
  //     <p>Panorama Dades - Your Home Away From Home</p>
  //   </div>
  // </body>
  // </html>
  //   `;
  // };

  // FR :
  const generateInvoiceHTML = () => {
    const totalHT = selectedInvoices.reduce((sum, inv) => {
      const amountHT = inv.amount * (1 - inv.discount / 100);
      return sum + amountHT;
    }, 0);

    const totalTVA = selectedInvoices.reduce((sum, inv) => {
      const amountHT = inv.amount * (1 - inv.discount / 100);
      const tvaAmount = amountHT * (inv.tva / 100);
      return sum + tvaAmount;
    }, 0);

    const totalTTC = totalHT + totalTVA;

    const getStatusEmoji = (status) => {
      switch (status?.toLowerCase()) {
        case 'payé': return '✅';
        case 'en attente': return '⏳';
        case 'annulé': return '❌';
        default: return '⏳';
      }
    };

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Helvetica', 'Arial', sans-serif;
      padding: 20px;
      color: #333;
      line-height: 1.6;
      max-width: 1000px;
      margin: 0 auto;
    }

    .logo-section {
      text-align: center;
      margin-bottom: 14px;
    }

    .logo-section img {
      height: 60px;
    }

    .logo-section h1 {
      font-size: 20px;
      color: #1e3a8a;
      margin-bottom: 15px;
      font-weight: 600;
    }

    .logo-section .divider {
      width: 100%;
      height: 3px;
      background: #1e3a8a;
      margin-top: 10px;
    }

    .invoice-info {
      display: flex;
      justify-content: space-between;
      margin: 8px 0;
      font-size: 14px;
    }

    .invoice-left p {
      margin: 5px 0;
      color: #4b5563;
    }

    .invoice-right {
      text-align: right;
    }

    .status-line {
      font-size: 16px;
      font-weight: 500;
    }

    .section-header {
      background: #1e3a8a;
      color: white;
      padding: 12px 20px;
      font-size: 16px;
      font-weight: 600;
      margin-top: 0;
      margin-bottom: 0;
    }

    .info-box {
      border: 1px solid #d1d5db;
      padding: 8px;
      margin-bottom: 20px;
      margin-top: 4px;
    }

    .info-box p {
      font-size: 14px;
      color: #4b5563;
    }

    .info-box .name {
      color: #1e3a8a;
      font-weight: 600;
      font-size: 16px;
      margin-bottom: 4px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 30px 0;
      overflow: hidden;
      border-radius: 8px;
    }

    thead {
      background: #1e3a8a;
      color: white;
    }

    th {
      padding: 14px 10px;
      text-align: left;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    td {
      padding: 12px 10px;
      border-bottom: 1px solid #e5e7eb;
      font-size: 13px;
      color: #374151;
    }

    tbody tr:last-child td {
      border-bottom: none;
    }

    tbody tr {
      background: white;
    }

    tbody tr:hover {
      background: #f9fafb;
    }

    .text-right { text-align: right; }
    .text-center { text-align: center; }

    .totals-section {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      width: 260px;
      font-size: 13px;
      color: #374151;
    }

    .total-row.final {
      border-top: 2px solid #1e3a8a;
      margin-top: 2px;
      font-size: 13px;
      font-weight: bold;
      color: #1e3a8a;
    }

    .amount-words {
      background: rgb(235, 213, 52, 0.2);
      padding: 8px;
      border-radius: 8px;
      font-style: italic;
      color: #374151;
      text-align: start;
      font-size: 12px;
      border-left: 4px solid orange;
      margin-block: 14px;
    }

    .footer {
      margin-top: 10px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      font-size: 10px;
      color: #9ca3af;
    }

    .footer p {
      margin: 4px 0;
    }
  </style>
</head>
<body>
  <!-- Logo and Title -->
  <div class="logo-section">
    <img src="{{LOGO_BASE64}}" alt="Logo">
    <h1>Facture</h1>
    <div class="divider"></div>
  </div>

  <!-- Invoice Info -->
  <div class="invoice-info">
    <div class="invoice-left">
      <p><strong>${selectedInvoices[0]?.code || ''}</strong></p>
      <p>Gorges Dades, ${new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </div>
    <div class="invoice-right">
      <p class="status-line"><strong>Statut :</strong> ${getStatusEmoji(selectedInvoices[0]?.status)} ${selectedInvoices[0]?.status || 'En attente'}</p>
    </div>
  </div>

  <!-- Customer Section -->
  <div class="section-header">Client</div>
  <div class="info-box">
    <p class="name">${selectedInvoices[0]?.customerName || 'N/A'}</p>
    <p>${selectedInvoices[0]?.customerEmail || 'N/A'}</p>
    <p>${selectedInvoices[0]?.customerPhone || 'N/A'}</p>
    <p>${selectedInvoices[0]?.customerAddress || 'N/A'}</p>
    <p>${selectedInvoices[0]?.customerCountry || 'N/A'}</p>
  </div>

  <!-- Supplier Section -->
  <div class="section-header">Fournisseur</div>
  <div class="info-box">
    <p class="name">Panorama Dades</p>
    <p>Georges Dades, Ait ibriren</p>
    <p>Boumalne dades 45150</p>
    <p>0668762022</p>
    <p>Auberge-panorama@hotmail.fr</p>
  </div>

  <!-- Invoice Table -->
  <table>
    <thead>
      <tr>
        <th>Désignation</th>
        <th class="text-right">Prix unitaire</th>
        <th class="text-center">Unité</th>
        <th class="text-center">Quantité</th>
        <th class="text-right">Montant</th>
        <th class="text-right">Remise</th>
        <th class="text-right">Montant HT</th>
      </tr>
    </thead>
    <tbody>
      ${selectedInvoices.map(inv => {
      const checkIn = new Date(inv.checkIn);
      const checkOut = new Date(inv.checkOut);
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      const unitPrice = inv.amount / nights;
      const amountHT = inv.amount * (1 - inv.discount / 100);

      return `
          <tr>
            <td>
              <strong>${inv.roomTitle}</strong><br>
            </td>
            <td class="text-right">${unitPrice.toFixed(2)} MAD</td>
            <td class="text-center">U</td>
            <td class="text-center">${nights}</td>
            <td class="text-right">${parseFloat(inv.amount).toFixed(2)} MAD</td>
            <td class="text-right">${inv.discount}%</td>
            <td class="text-right">${amountHT.toFixed(2)} MAD</td>
          </tr>
        `;
    }).join('')}
    </tbody>
  </table>

  <!-- Totals -->
  <div class="totals-section">
    <div class="total-row">
      <span>Total HT :</span>
      <span>${totalHT.toFixed(2)} MAD</span>
    </div>
    <div class="total-row">
      <span>TVA :</span>
      <span>${totalTVA.toFixed(2)} MAD</span>
    </div>
    <div class="total-row final">
      <span>TOTAL TTC À PAYER :</span>
      <span>${totalTTC.toFixed(2)} MAD</span>
    </div>
  </div>

  <!-- Amount in Words -->
  <div class="amount-words">
    <strong>Montant en lettres :</strong> ${numberToWords(totalTTC)}
  </div>

  <!-- Footer -->
  <div class="footer">
    <p>Merci pour votre confiance !</p>
    <p>Panorama Dades - Votre maison loin de chez vous</p>
  </div>
</body>
</html>
  `;
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'canceled':
        return 'bg-gray-100 text-gray-500 border-gray-200';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  const getRowStyle = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-50/30 hover:bg-green-50/50';
      case 'canceled':
        return 'opacity-50 line-through hover:bg-gray-50/50';
      default:
        return 'hover:bg-amber-50/30';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const canPerformActions = selectedInvoices.length > 0 && selectedInvoices.every(inv => inv.status === 'pending');

  return (
    <div className="min-h-screen bg-stone-50 relative overflow-hidden md:ml-16">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-radial from-amber-200/60 via-amber-100/30 to-transparent rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-gradient-radial from-stone-300/50 via-stone-200/20 to-transparent rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-gradient-radial from-amber-300/40 via-transparent to-transparent rounded-full blur-3xl animate-float-slow" />
      </div>

      {/* Header Section */}
      <section className="relative pt-28 pb-16 px-8 lg:px-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col gap-6 mb-12">
            <div className="space-y-4">
              <div className="text-xs tracking-[0.4em] uppercase text-amber-900 font-semibold">
                Administration
              </div>
              <div className="w-16 h-px bg-amber-900" />
              <h1 className="text-2xl md:text-4xl font-serif font-bold text-stone-900 leading-tight">
                Invoices
                <span className="ml-2 italic text-amber-900">Management</span>
              </h1>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handlePreview}
                disabled={selectedInvoices.length === 0 || processing}
                className="group relative px-6 py-3 overflow-hidden rounded font-medium tracking-wider uppercase disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-900 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="relative z-10 text-white flex items-center space-x-2 text-sm">
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </span>
              </button>

              <button
                onClick={() => setValidateModal(true)}
                disabled={!canPerformActions || processing}
                className="group relative px-6 py-3 overflow-hidden rounded font-medium tracking-wider uppercase disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-800" />
                <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-green-900 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="relative z-10 text-white flex items-center space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>Validate</span>
                </span>
              </button>

              <button
                onClick={() => setCancelModal(true)}
                disabled={!canPerformActions || processing}
                className="group relative px-6 py-3 overflow-hidden rounded font-medium tracking-wider uppercase disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-rose-800" />
                <div className="absolute inset-0 bg-gradient-to-r from-rose-700 to-rose-900 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="relative z-10 text-white flex items-center space-x-2 text-sm">
                  <XCircle className="w-4 h-4" />
                  <span>Cancel</span>
                </span>
              </button>

              <button
                onClick={handleDownload}
                disabled={selectedInvoices.length === 0 || processing}
                className="group relative px-6 py-3 overflow-hidden rounded font-medium tracking-wider uppercase disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-800" />
                <div className="absolute inset-0 bg-gradient-to-r from-amber-700 to-amber-900 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="relative z-10 text-white flex items-center space-x-2 text-sm">
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </span>
              </button>

              <button
                onClick={handlePrint}
                disabled={selectedInvoices.length === 0 || processing}
                className="group relative px-6 py-3 overflow-hidden rounded font-medium tracking-wider uppercase disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-800" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-purple-900 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="relative z-10 text-white flex items-center space-x-2 text-sm">
                  <Printer className="w-4 h-4" />
                  <span>Print</span>
                </span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Total', value: invoices.length, color: 'amber' },
              { label: 'Pending', value: invoices.filter(i => i.status === 'pending').length, color: 'blue' },
              { label: 'Paid', value: invoices.filter(i => i.status === 'paid').length, color: 'green' },
              { label: 'Selected', value: selectedInvoices.length, color: 'purple' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-stone-200/50 shadow-lg">
                <div className="text-sm font-semibold text-stone-600 uppercase tracking-wider mb-2">
                  {stat.label}
                </div>
                <div className={`text-4xl font-serif font-bold text-${stat.color}-900`}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-stone-200/50 shadow-lg mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search by code, customer or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-900 focus:outline-none transition-colors"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-900 focus:outline-none transition-colors appearance-none bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="canceled">Canceled</option>
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-900 focus:outline-none transition-colors appearance-none bg-white"
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Invoices Table */}
      <section className="relative pb-32 px-8 lg:px-16">
        <div className="max-w-[1600px] mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 border-4 border-amber-900/20 border-t-amber-900 rounded-full animate-spin mx-auto" />
                <p className="text-stone-600 font-light">Loading invoices...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-8 text-center">
              <AlertCircle className="w-12 h-12 text-rose-600 mx-auto mb-4" />
              <p className="text-rose-900 text-lg font-medium">{error}</p>
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm border-2 border-stone-200 rounded-2xl p-12 text-center">
              <Coins className="w-16 h-16 text-stone-400 mx-auto mb-4" />
              <p className="text-stone-600 text-lg font-light">No invoices found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Table Container */}
              <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-stone-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-amber-50 to-amber-100/50 border-b-2 border-amber-200">
                        <th className="px-6 py-4 text-left">
                          Select
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-amber-900 uppercase tracking-wider">
                          Code
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-amber-900 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-amber-900 uppercase tracking-wider">
                          Reservation
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-amber-900 uppercase tracking-wider">
                          Amount (MAD)
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-amber-900 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-amber-900 uppercase tracking-wider">
                          Date Created
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {currentInvoices.map((invoice) => {
                        const isSelected = selectedInvoices.some(inv => inv.id === invoice.id);
                        const canSelect = selectedInvoices.length === 0 || selectedInvoices[0].customerID === invoice.customerID;

                        return (
                          <tr
                            key={invoice.id}
                            className={`transition-colors duration-150 ${getRowStyle(invoice.status)}`}
                          >
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleSelectInvoice(invoice)}
                                disabled={!canSelect && !isSelected}
                                className="w-5 h-5 rounded border-2 border-amber-600 text-amber-600 focus:ring-2 focus:ring-amber-500 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-mono font-semibold text-stone-900">
                                {invoice.code}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-semibold text-stone-900">
                                {invoice.customerName}
                              </div>
                              <div className="text-xs text-stone-500">
                                ID: #{invoice.customerID}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-stone-700">
                                Res. #{invoice.reservationID}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-semibold text-stone-900">
                                {(invoice.discount > 0 || invoice.tva > 0) ? (
                                  <>
                                    <div className="text-sm font-semibold text-stone-900">
                                      {(parseFloat(invoice.amount) * (1 - invoice.discount / 100) * (1 + invoice.tva / 100)).toFixed(2)}
                                    </div>
                                    <div className="text-xs text-stone-500 line-through">
                                      {parseFloat(invoice.amount).toFixed(2)}
                                    </div>
                                  </>
                                ) : (
                                  <div className="text-sm font-semibold text-stone-900">
                                    {parseFloat(invoice.amount).toFixed(2)}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(invoice.status)}`}>
                                {invoice.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-stone-600 whitespace-nowrap">
                              {formatDate(invoice.dateCreation)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-stone-200/50 shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Results Info */}
                  <div className="text-sm text-stone-600 text-center md:text-left">
                    Showing <span className="font-semibold text-stone-900">{startIndex + 1}</span> to{' '}
                    <span className="font-semibold text-stone-900">{Math.min(endIndex, filteredInvoices.length)}</span> of{' '}
                    <span className="font-semibold text-stone-900">{filteredInvoices.length}</span> invoices
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex flex-wrap items-center justify-center md:justify-end gap-2">
                    {/* Items per page */}
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="px-3 py-2 border-2 border-stone-200 rounded-lg focus:border-amber-900 focus:outline-none transition-colors text-sm"
                    >
                      <option value={5}>5 per page</option>
                      <option value={10}>10 per page</option>
                      <option value={20}>20 per page</option>
                      <option value={50}>50 per page</option>
                    </select>

                    {/* Previous Button */}
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 border-2 border-stone-200 rounded-lg hover:bg-amber-50 hover:border-amber-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-stone-200 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-stone-700" />
                    </button>

                    {/* Page Numbers */}
                    <div className="flex flex-wrap items-center justify-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNumber;
                        if (totalPages <= 5) {
                          pageNumber = i + 1;
                        } else if (currentPage <= 3) {
                          pageNumber = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i;
                        } else {
                          pageNumber = currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNumber}
                            onClick={() => goToPage(pageNumber)}
                            className={`px-3 md:px-4 py-2 rounded-lg font-medium text-sm transition-colors ${currentPage === pageNumber
                              ? 'bg-gradient-to-r from-amber-600 to-amber-800 text-white'
                              : 'border-2 border-stone-200 text-stone-700 hover:bg-amber-50 hover:border-amber-300'
                              }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 border-2 border-stone-200 rounded-lg hover:bg-amber-50 hover:border-amber-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-stone-200 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-stone-700" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Preview Modal */}
      {previewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm animate-fade-in">
          <div
            ref={previewModalRef}
            className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl border border-stone-200 overflow-hidden animate-scale-in max-h-[90vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-serif font-bold text-white">Invoice Preview</h3>
                <button
                  onClick={() => {
                    setPreviewModal(false);
                    setPdfUrl(null);
                  }}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-auto p-4">
              {pdfUrl ? (
                <iframe
                  src={pdfUrl}
                  className="w-full h-full min-h-[600px] rounded-lg border-2 border-stone-200"
                  title="Invoice Preview"
                />
              ) : (
                <div className="flex items-center justify-center h-96">
                  <div className="w-16 h-16 border-4 border-blue-900/20 border-t-blue-900 rounded-full animate-spin" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Validate Modal */}
      {validateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm animate-fade-in">
          <div
            ref={validateModalRef}
            className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden animate-scale-in"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-800 px-8 py-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-serif font-bold text-white">Validate Payment</h3>
                <button
                  onClick={() => {
                    setValidateModal(false);
                    resetPaymentData();
                  }}
                  className="text-white/80 hover:text-white transition-colors"
                  disabled={processing}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleValidate} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-stone-700 uppercase tracking-wider mb-2">
                  Payment Mode <span className="text-rose-600">*</span>
                </label>
                <select
                  value={paymentData.mode}
                  onChange={(e) => setPaymentData({ ...paymentData, mode: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-900 focus:outline-none transition-colors"
                  required
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="bank">Bank Transfer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 uppercase tracking-wider mb-2">
                  Amount <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Coins className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
                  <input
                    type="number"
                    step="0.01"
                    value={paymentData.amount}
                    onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-gray-200 border-2 border-stone-300 cursor-not-allowed rounded-lg focus:border-amber-900 focus:outline-none transition-colors"
                    required
                    disabled
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 uppercase tracking-wider mb-2">
                  Note
                </label>
                <textarea
                  value={paymentData.note}
                  onChange={(e) => setPaymentData({ ...paymentData, note: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-900 focus:outline-none transition-colors resize-none"
                  placeholder="Optional payment notes..."
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setValidateModal(false);
                    resetPaymentData();
                  }}
                  disabled={processing}
                  className="flex-1 px-6 py-4 border-2 border-stone-300 text-stone-700 rounded-lg font-medium tracking-wider uppercase hover:bg-stone-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg font-medium tracking-wider uppercase hover:from-green-700 hover:to-green-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {processing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Validate</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm animate-fade-in">
          <div
            ref={cancelModalRef}
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden animate-scale-in"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-rose-600 to-rose-800 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white">Cancel Invoices</h3>
                </div>
                <button
                  onClick={() => setCancelModal(false)}
                  className="text-white/80 hover:text-white transition-colors"
                  disabled={processing}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-6">
              <p className="text-stone-600 leading-relaxed">
                Are you sure you want to cancel <span className="font-semibold text-stone-900">{selectedInvoices.length}</span> invoice(s)? This will also cancel the associated reservations. This action cannot be undone.
              </p>

              <div className="flex space-x-4">
                <button
                  onClick={() => setCancelModal(false)}
                  disabled={processing}
                  className="flex-1 px-6 py-4 border-2 border-stone-300 text-stone-700 rounded-lg font-medium tracking-wider uppercase hover:bg-stone-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  No, Keep
                </button>
                <button
                  onClick={handleCancel}
                  disabled={processing}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-rose-600 to-rose-800 text-white rounded-lg font-medium tracking-wider uppercase hover:from-rose-700 hover:to-rose-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {processing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Canceling...</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5" />
                      <span>Yes, Cancel</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps({ req, res }) {
  const root = verifyAuth(req, res);

  if (!root) {
    return {
      redirect: {
        destination: "/admin/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session: { connected: true } },
  };
}