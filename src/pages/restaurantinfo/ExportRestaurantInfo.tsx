import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { RestaurantInfoValues } from "../../types/RestaurantInfoTypes";

type ExportFormat = "csv" | "excel" | "pdf";

const downloadFile = (blob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
};

export const ExportRestaurantInfo = (
  restaurants: RestaurantInfoValues[],
  format: ExportFormat,
) => {
  if (!restaurants?.length) return;

  //Format data 
  const data = restaurants.map((r) => ({
    "Restaurant Name": r.restaurantName,
    "Owner Name": r.ownerName,
    "Total Branches": r.branches?.length ?? 0,
    "Total Menu Items": r.menuItems?.length ?? 0,
  }));

  const today = new Date().toLocaleDateString("en-GB").replace(/\//g, "-");
  const fileName = "restaurant-info";

  //  CSV 
  if (format === "csv") {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    downloadFile(blob, `${fileName}-${today}.csv`);
  }

  // ---------------- EXCEL (Styled) ----------------
if (format === "excel") {
  const worksheet = XLSX.utils.json_to_sheet(data);

  type RowType = typeof data[number];
  const keys = Object.keys(data[0]) as (keyof RowType)[];

  const columnWidths = keys.map((key) => ({
    wch:
      Math.max(
        key.length,
        ...data.map((row) => String(row[key]).length),
      ) + 2,
  }));

  worksheet["!cols"] = columnWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Restaurants");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, `restaurant-info-${today}.xlsx`);
}

  // PDF
  if (format === "pdf") {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Restaurant Information", 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [Object.keys(data[0])],
      body: data.map((row) => Object.values(row)),
      styles: { fontSize: 10 },
      headStyles: {
        fillColor: [25, 118, 210], // MUI primary blue
      },
      theme: "grid",
    });

    doc.save(`${fileName}-${today}.pdf`);
  }
};
