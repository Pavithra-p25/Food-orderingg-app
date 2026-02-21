import * as XLSX from "xlsx";
import type { Restaurant } from "../../types/RestaurantTypes";
import { setAutoColumnWidth } from "../../utils/export/ExcelColumnWidth";

export const exportExcelAllTabs = (
  results: Restaurant[],
  formatRowForExport: (row: Restaurant) => Record<string, any>,
  onCloseExport: () => void,
) => {
  const allTabs = [
    { name: "All", data: results.map(formatRowForExport) },
    {
      name: "Active",
      data: results
        .filter((r: Restaurant) => r.isActive)
        .map(formatRowForExport),
    },
    {
      name: "Inactive",
      data: results
        .filter((r: Restaurant) => !r.isActive)
        .map(formatRowForExport),
    },
  ];

  const workbook = XLSX.utils.book_new();

  //  CREATE SUMMARY SHEET

  const summaryData = [
    ["Restaurant Report Summary"],
    [],
    ["Total Restaurants", results.length.toString()],
    ["Active Restaurants", results.filter((r) => r.isActive).length.toString()],
    [
      "Inactive Restaurants",
      results.filter((r) => !r.isActive).length.toString(),
    ],
    [],
    ["Included Sheets:"],
    ...allTabs.map((tab) => [tab.name, `${tab.data.length} records`]),
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);

  ["B3", "B4", "B5"].forEach((cell) => {
    if (summarySheet[cell]) {
      summarySheet[cell].t = "s"; // force string
    }
  });

  // Auto width for summary sheet
  summarySheet["!cols"] = [{ wch: 25 }, { wch: 20 }];

  XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");

  // ADD DATA SHEETS

  allTabs.forEach((tab) => {
    const aoa = [
      Object.keys(tab.data[0] || {}),
      ...tab.data.map((row) => Object.values(row)),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(aoa);
    worksheet["!cols"] = setAutoColumnWidth(aoa);

    const columns = Object.keys(tab.data[0] || {});
    const colWidths = columns.map((col) => {
      const maxLength = Math.max(
        col.length,
        ...tab.data.map((row) => ((row[col] || "") + "").length),
      );
      return { wch: maxLength + 2 };
    });

    worksheet["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, tab.name);
  });

  XLSX.writeFile(workbook, "Restaurants.xlsx");

  onCloseExport();
};
