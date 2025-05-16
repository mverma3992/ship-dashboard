/**
 * Exports data to a CSV file
 * @param {Array} data - The data to export (array of objects)
 * @param {string} filename - The name of the file to download
 * @param {Array} headers - Optional array of header names. If not provided, will use Object.keys of first item
 */
export function exportToCSV(data, filename = "report.csv", headers = null) {
  if (!data || !data.length) {
    console.warn("No data to export");
    return;
  }

  // Get headers from data if not provided
  const headerValues = headers || Object.keys(data[0]);
  
  // Create CSV header row
  const csvHeader = headerValues.join(",");
  
  // Create CSV content from data
  const csvRows = data.map(row => {
    return headerValues.map(header => {
      // Handle values that might contain commas
      const cellValue = row[header] !== undefined && row[header] !== null 
        ? String(row[header]) 
        : "";
      // Escape quotes and wrap in quotes if contains comma
      if (cellValue.includes(",") || cellValue.includes('"')) {
        return `"${cellValue.replace(/"/g, '""')}"`;
      }
      return cellValue;
    }).join(",");
  });
  
  // Combine header and rows
  const csvContent = [csvHeader, ...csvRows].join("\n");
  
  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.display = "none";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Cleanup
  URL.revokeObjectURL(url);
} 