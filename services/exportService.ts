

/**
 * Escapes a value for CSV format. If the value contains a comma, double quote, or newline,
 * it will be enclosed in double quotes. Existing double quotes will be escaped by doubling them.
 * @param value The value to escape.
 * @returns The escaped string value.
 */
const escapeCsvValue = (value: any): string => {
    if (value == null) { // Catches null and undefined
        return '';
    }
    const strValue = String(value);
    if (/[",\n]/.test(strValue)) {
        return `"${strValue.replace(/"/g, '""')}"`;
    }
    return strValue;
};

interface CsvHeader {
    key: string;
    label: string;
}

/**
 * Converts an array of objects to a CSV string and triggers a download.
 * @param data The array of objects to export.
 * @param headers An array of header objects with 'key' and 'label'.
 * @param fileName The name of the file to be downloaded (e.g., 'export.csv').
 */
export const exportToCsv = (data: any[], headers: CsvHeader[], fileName: string) => {
    const csvRows: string[] = [];

    // Add header row
    const headerValues = headers.map(h => escapeCsvValue(h.label));
    csvRows.push(headerValues.join(','));

    // Add data rows
    data.forEach(item => {
        const rowValues = headers.map(header => {
            // Support nested keys like 'location.0' by reducing
            const value = header.key.split('.').reduce((obj, key) => (obj && obj[key] !== undefined) ? obj[key] : '', item);
            return escapeCsvValue(value);
        });
        csvRows.push(rowValues.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
