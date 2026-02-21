import * as XLSX from "xlsx";
import type { RestaurantInfoValues } from "../../types/RestaurantInfoTypes";
import { getToday } from "../../utils/export/ExportData";
import { setAutoColumnWidth } from "../../utils/export/ExcelColumnWidth";

  export const exportPreviewExcel = (restaurant: RestaurantInfoValues) => {
    const rows: any[][] = [];

    // RESTAURANT INFORMATION
    rows.push(["RESTAURANT INFORMATION", "", "", ""]);
    rows.push([]);

    rows.push(["Restaurant Name", restaurant.restaurantName, "", ""]);
    rows.push(["Owner Name", restaurant.ownerName, "", ""]);
    rows.push([]);

    // BRANCHES
    rows.push(["BRANCHES", "", "", ""]);
    rows.push([]);

    rows.push([
      "Branch Name",
      "Branch Code",
      "License Type",
      "License Number",
      "Valid From",
      "Valid Till",
      "Status",
    ]);

    restaurant.branches?.forEach((branch) => {
      if (branch.complianceDetails?.length) {
        branch.complianceDetails.forEach((c) => {
          const isExpired = new Date(c.validTill) < new Date();

          rows.push([
            branch.branchName,
            branch.branchCode,
            c.licenseType,
            c.licenseNumber,
            new Date(c.validFrom).toLocaleDateString(),
            new Date(c.validTill).toLocaleDateString(),
            isExpired ? "Expired" : "Active",
          ]);
        });
      } else {
        rows.push([
          branch.branchName,
          branch.branchCode,
          "No Compliance",
          "",
          "",
          "",
          "",
        ]);
      }
    });

    rows.push([]);
    rows.push([]);

    // MENU ITEMS
    rows.push(["MENU ITEMS", "", "", ""]);
    rows.push([]);

    rows.push(["Item Name", "Category", "Price"]);

    restaurant.menuItems?.forEach((item) => {
      rows.push([item.itemName, item.category, `₹ ${item.price}`]);
    });

    // Create sheet
    const worksheet = XLSX.utils.aoa_to_sheet(rows);

    // Merge heading rows
    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }, // Restaurant Info
      { s: { r: 5, c: 0 }, e: { r: 5, c: 6 } }, // Branches
      {
        s: { r: rows.findIndex((r) => r[0] === "MENU ITEMS"), c: 0 },
        e: { r: rows.findIndex((r) => r[0] === "MENU ITEMS"), c: 6 },
      },
    ];


   worksheet["!cols"] = setAutoColumnWidth(rows);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      restaurant.restaurantName.substring(0, 31),
    );

    XLSX.writeFile(workbook, `${restaurant.restaurantName}-${getToday()}.xlsx`);
  };
