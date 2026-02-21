import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const getToday = () =>
  new Date().toLocaleDateString("en-GB").replace(/\//g, "-"); //to get date

type GenericData = Record<string, any>[];
type ExportFormat = "csv" | "excel" | "pdf";

 export type ExportOptions = {
  sheetName?: string; //for excel sheet 
  title?: string; //pdf title 
  columns?: string[]; // column order
  headerMap?: Record<string, string>;// rename headers
   orientation?: "portrait" | "landscape"; //pdf orientation 
};

/*  HELPER */

const normalizeData = (
  data: GenericData,
  columns?: string[],
  headerMap?: Record<string, string>
) => {
  if (!data.length) return { rows: [], headers: [] };

  const keys = columns ?? Object.keys(data[0]);

  const headers = keys.map((key) => headerMap?.[key] ?? key);

  const rows = data.map((row) =>
    keys.map((key) => row[key] ?? "")
  );

  return { rows, headers, keys };
};

/* CSV */

const exportCsv = (
  data: GenericData,
  fileName: string,
  options?: ExportOptions
) => {
  const { headers, rows } = normalizeData(
    data,
    options?.columns,
    options?.headerMap
  );

  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  const csv = XLSX.utils.sheet_to_csv(worksheet); //convert data to csv using sheetjs 

  const blob = new Blob([csv], { //wrap data into blob 
    type: "text/csv;charset=utf-8;",
  });

  saveAs(blob, `${fileName}-${getToday()}.csv`); //download
};

/* EXCEL */

const exportExcel = (
  data: GenericData,
  fileName: string,
  options?: ExportOptions
) => {
  const { headers, rows } = normalizeData(
    data,
    options?.columns,
    options?.headerMap
  );

  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);

  //column widths based on content 
  worksheet["!cols"] = headers.map((header, index) => ({
    wch:
      Math.max(
        header.length,
        ...rows.map((row) => String(row[index]).length)
      ) + 2,
  }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    options?.sheetName ?? "Sheet1"
  );

  const buffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([buffer], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, `${fileName}-${getToday()}.xlsx`);
};

/*PDF */
export const exportPdf = (
  data: any[],
  fileName: string,
  options?: ExportOptions
) => {
  const doc = new jsPDF({
    orientation: options?.orientation ?? "portrait", // now allowed
    unit: "pt",
    format: "a4",
  });

  if (options?.title) {
    doc.setFontSize(16);
    doc.text(options.title, 40, 30);
  }

  autoTable(doc, {
    startY: options?.title ? 50 : 30,
    head: [Object.keys(data[0] || {})],
    body: data.map((row) => Object.values(row)),
    styles: { fontSize: 10 },
    theme: "grid",
  });

  doc.save(`${fileName}.pdf`);
};


/*  MAIN REUSABLE FUNCTION */
//Pass data , format , fileName , options.
export const exportData = (
  data: GenericData,
  format: ExportFormat,
  fileName: string,
  options?: ExportOptions
) => {
  if (!data?.length) return;

  const exporters: Record<ExportFormat, () => void> = {
    csv: () => exportCsv(data, fileName, options),
    excel: () => exportExcel(data, fileName, options),
    pdf: () => exportPdf(data, fileName, options),
  };

  exporters[format]();
};
