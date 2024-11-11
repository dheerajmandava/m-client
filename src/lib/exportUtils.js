import { formatIndianCurrency } from './utils';

export function exportToCSV(data, filename) {
  const csvContent = convertToCSV(data);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function convertToCSV(data) {
  const headers = Object.keys(data[0]);
  const rows = data.map(item => 
    headers.map(header => 
      typeof item[header] === 'number' ? item[header].toString() : 
      `"${item[header]}"`
    ).join(',')
  );
  return [headers.join(','), ...rows].join('\n');
}

export function generateInventoryReport(inventory, orders) {
  return inventory.map(item => {
    const itemOrders = orders.filter(order => 
      order.items.some(orderItem => orderItem.partNumber === item.partNumber)
    );

    return {
      'Part Number': item.partNumber,
      'Name': item.name,
      'Current Stock': item.quantity,
      'Min Quantity': item.minQuantity,
      'Cost Price': formatIndianCurrency(item.costPrice),
      'Total Value': formatIndianCurrency(item.quantity * item.costPrice),
      'Last Order Date': itemOrders.length ? 
        new Date(itemOrders[0].createdAt).toLocaleDateString() : 'N/A',
      'Status': item.quantity <= item.minQuantity ? 'Low Stock' : 'In Stock'
    };
  });
} 