import React, { useState, useEffect, useRef } from "react";
import { Container, Paper, Box, Typography } from "@mui/material";
import MyTable from "../../components/newcomponents/table/MyTable";
import { useRestaurantInfo } from "../../hooks/restaurantinfo/useRestaurantInfo";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import EditNoteIcon from "@mui/icons-material/EditNote";
import VisibilityIcon from "@mui/icons-material/Visibility";
import type { RestaurantInfoValues } from "../../types/RestaurantInfoTypes";
import MyDialog from "../../components/newcomponents/dialog/MyDialog";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import MyButton from "../../components/newcomponents/button/MyButton";
import { useRestaurantListHandlers } from "../../hooks/restaurantinfo/useRestaurantListHandlers";
import { useDialogSnackbar } from "../../context/DialogSnackbarContext";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DescriptionIcon from "@mui/icons-material/Description";
import TableChartIcon from "@mui/icons-material/TableChart";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { exportData, getToday } from "../../utils/ExportData";
import * as XLSX from "xlsx";


const RestaurantInfoList = () => {
  const { restaurantInfoList, fetchRestaurantInfo, removeRestaurantInfo } =
    useRestaurantInfo();

  const navigate = useNavigate();
  const [, setEditingRestaurant] = useState<RestaurantInfoValues | null>(null);

  const [previewRestaurant, setPreviewRestaurant] =
    React.useState<RestaurantInfoValues | null>(null);
  const [deleteRestaurant, setDeleteRestaurant] =
    useState<RestaurantInfoValues | null>(null);

  const { showDialog, showSnackbar } = useDialogSnackbar();
  const previewRef = useRef<HTMLDivElement>(null);

  const { handleDelete } = useRestaurantListHandlers({
    setEditingRestaurant,
    setPreviewRestaurant,
    setDeleteRestaurant,
    deleteRestaurant,
  });

  useEffect(() => {
    fetchRestaurantInfo();
  }, []);

  const restaurantColumns = [
    {
      id: "restaurantName",
      label: "Restaurant Name",
      sortable: true,
      align: "left" as const,
    },
    { id: "ownerName", label: "Owner Name", align: "left" as const },
    {
      id: "branches",
      label: "Branches",
      render: (row: any) => row.branches?.length ?? 0,
      align: "center" as const,
    },
    {
      id: "menuItems",
      label: "Menu Items",
      render: (row: any) => row.menuItems?.length ?? 0,
      align: "center" as const,
    },
    {
      id: "actions",
      label: "Actions",
      sortable: false,
      align: "center" as const,
      width: 180,
      render: (row: RestaurantInfoValues) => (
        <Box
          display="flex"
          gap={1}
          justifyContent="center"
          sx={{ minWidth: 170 }}
        >
          {/* Edit */}
          <Tooltip title="Edit">
            <IconButton
              color="primary"
              onClick={() => navigate(`/restaurant-info/edit/${row.id}`)}
            >
              <EditNoteIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Preview */}
          <Tooltip title="Preview">
            <IconButton
              color="success"
              onClick={() => setPreviewRestaurant(row)}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Delete */}
          <Tooltip title="Delete">
            <IconButton color="error" onClick={() => handleDelete(row)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const exportPreviewAsPdf = async (
    previewRef: React.RefObject<HTMLDivElement | null>,
    fileName: string,
  ) => {
    if (!previewRef.current) return;

    const clonedElement = previewRef.current.cloneNode(true) as HTMLElement;

    clonedElement.style.position = "absolute";
    clonedElement.style.top = "-9999px";
    clonedElement.style.left = "-9999px";
    clonedElement.style.display = "block";
    clonedElement.style.width = previewRef.current.offsetWidth + "px";

    // Show PDF-only elements
    clonedElement.querySelectorAll(".pdf-only").forEach((el) => {
      (el as HTMLElement).style.display = "block";
    });

    // Hide buttons
    clonedElement.querySelectorAll(".no-print").forEach((el) => {
      (el as HTMLElement).style.display = "none";
    });

    document.body.appendChild(clonedElement);

    const canvas = await html2canvas(clonedElement, {
      scale: 2,
      useCORS: true,
      scrollY: -window.scrollY,
    });

    document.body.removeChild(clonedElement);

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(`${fileName}-${getToday()}.pdf`);
  };

  const exportRestaurantPreviewExcel = (restaurant: RestaurantInfoValues) => {
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

    // Auto column width
    const colCount = Math.max(...rows.map((r) => r.length));

    worksheet["!cols"] = Array.from({ length: colCount }).map((_, i) => ({
      wch:
        Math.max(
          15,
          ...rows.map((row) => (row[i] ? String(row[i]).length : 0)),
        ) + 2,
    }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      restaurant.restaurantName.substring(0, 31),
    );

    XLSX.writeFile(workbook, `${restaurant.restaurantName}-${getToday()}.xlsx`);
  };

  //csv row
  const formatPreviewCsvData = (restaurant: RestaurantInfoValues) => {
  const rows: any[] = [];

  // Header row
  rows.push([
    "Restaurant Name",
    "Owner Name",
    "Branch Name",
    "Branch Code",
    "License Type",
    "License Number",
    "Valid From",
    "Valid Till",
    "Status",
    "Menu Item",
    "Category",
    "Price",
  ]);

  // Branches with compliance
  if (restaurant.branches?.length) {
    restaurant.branches.forEach((branch) => {
      if (branch.complianceDetails?.length) {
        branch.complianceDetails.forEach((c) => {
          const isExpired = new Date(c.validTill) < new Date();
          rows.push([
            restaurant.restaurantName,
            restaurant.ownerName,
            branch.branchName,
            branch.branchCode,
            c.licenseType,
            c.licenseNumber,
            new Date(c.validFrom).toLocaleDateString(),
            new Date(c.validTill).toLocaleDateString(),
            isExpired ? "Expired" : "Active",
            "", // Menu item columns left empty for branch rows
            "",
            "",
          ]);
        });
      } else {
        rows.push([
          restaurant.restaurantName,
          restaurant.ownerName,
          branch.branchName,
          branch.branchCode,
          "No Compliance",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ]);
      }
    });
  }

  // Menu items (once per restaurant)
  if (restaurant.menuItems?.length) {
    restaurant.menuItems.forEach((item) => {
      rows.push([
        restaurant.restaurantName,
        restaurant.ownerName,
        "", // Branch columns empty
        "",
        "",
        "",
        "",
        "",
        "",
        item.itemName,
        item.category,
        item.price,
      ]);
    });
  }

  return rows;
};


  const formatWholeExportData = (restaurants: RestaurantInfoValues[]) => {
    return restaurants.map((r) => ({
      "Restaurant Name": r.restaurantName,
      "Owner Name": r.ownerName,
      "Total Branches": r.branches?.length ?? 0,
      "Total Menu Items": r.menuItems?.length ?? 0,
    }));
  };


  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 4 } }}>
      <Paper elevation={6} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 4 }}>
        <Typography variant="h6" fontWeight="bold" mb={3} textAlign="center">
          Restaurant Information List
        </Typography>

        <Box display="flex" justifyContent="flex-end" mb={2}>
          <MyButton
            variant="contained"
            startIcon={<FileDownloadIcon />}
            disabled={!restaurantInfoList?.length}
            onClick={() => {
              showDialog({
                title: "Select Export Format",
                maxWidth: "xs",
                content: (
                  <Stack spacing={2} mt={1}>
                    {/* CSV - Blue */}
                    <MyButton
                      variant="primary"
                      startIcon={<DescriptionIcon />}
                      onClick={() => {
                        exportData(
                          formatWholeExportData(restaurantInfoList),
                          "csv",
                          "restaurant-info",
                        );
                        showSnackbar("CSV downloaded successfully", "success");
                      }}
                    >
                      Export as CSV
                    </MyButton>

                    {/* Excel - Green */}
                    <MyButton
                      variant="success"
                      startIcon={<TableChartIcon />}
                      onClick={() => {
                        exportData(
                          formatWholeExportData(restaurantInfoList),
                          "excel",
                          "restaurant-info",
                          { sheetName: "Restaurants" },
                        );
                        showSnackbar(
                          "Excel downloaded successfully",
                          "success",
                        );
                      }}
                    >
                      Export as Excel
                    </MyButton>

                    {/* PDF - Red */}
                    <MyButton
                      variant="cancel"
                      startIcon={<PictureAsPdfIcon />}
                      onClick={() => {
                        exportData(
                          formatWholeExportData(restaurantInfoList),
                          "pdf",
                          "restaurant-info",
                          { title: "Restaurant Information" },
                        );
                        showSnackbar("PDF downloaded successfully", "success");
                      }}
                    >
                      Export as PDF
                    </MyButton>
                  </Stack>
                ),
              });
            }}
          >
            Export
          </MyButton>
        </Box>

        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <Box sx={{ minWidth: { xs: 900, md: "100%" } }}>
            <MyTable
              columns={restaurantColumns}
              rows={restaurantInfoList}
              rowId={(row: any) => row.id}
              enableExpand
              selectable={false}
              pagination={false}
              expandedContent={(row: any) => (
                <Box>
                  <Typography fontWeight="bold" mb={1}>
                    Owner
                  </Typography>
                  <Typography mb={2}>{row.ownerName}</Typography>

                  <Typography fontWeight="bold" mb={1}>
                    Branches
                  </Typography>
                  {row.branches?.map((branch: any, bIndex: number) => (
                    <Paper key={bIndex} sx={{ p: 2, mb: 2 }}>
                      <Typography fontWeight="bold">
                        {branch.branchName} ({branch.branchCode})
                      </Typography>

                      {branch.complianceDetails?.length > 0 && (
                        <Box mt={1}>
                          <Typography fontWeight="bold" fontSize={14}>
                            Compliance Details
                          </Typography>
                          {branch.complianceDetails.map(
                            (c: any, cIndex: number) => (
                              <Box key={cIndex} ml={2} mt={0.5}>
                                • {c.licenseType.toUpperCase()} –{" "}
                                {c.licenseNumber}
                                <br />
                                <small>
                                  {new Date(c.validFrom).toLocaleDateString()} →{" "}
                                  {new Date(c.validTill).toLocaleDateString()}
                                </small>
                              </Box>
                            ),
                          )}
                        </Box>
                      )}
                    </Paper>
                  ))}

                  <Typography fontWeight="bold" mb={1}>
                    Menu Items
                  </Typography>
                  {row.menuItems?.map((item: any, i: number) => (
                    <Box key={i} ml={2} mb={0.5}>
                      • {item.itemName} ({item.category}) – ₹{item.price}
                    </Box>
                  ))}
                </Box>
              )}
            />
          </Box>
        </Box>
      </Paper>
      <MyDialog
        open={!!previewRestaurant}
        title={previewRestaurant?.restaurantName?.toUpperCase() || "Preview"}
        onClose={() => setPreviewRestaurant(null)}
        maxWidth="md"
      >
        {previewRestaurant && (
          <Box ref={previewRef} sx={{ p: 3, backgroundColor: "#fff" }}>
            {/* Restaurant Name - Only for PDF */}
            <Typography
              variant="h5"
              fontWeight="bold"
              textAlign="center"
              mb={3}
              sx={{ display: "none" }}
              className="pdf-only"
            >
              {previewRestaurant.restaurantName.toUpperCase()}
            </Typography>

            {/* Restaurant Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
                borderBottom: "2px solid #1976d2",
                pb: 2,
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Owner: {previewRestaurant.ownerName.toUpperCase()}
              </Typography>

              <Box className="no-print">
                <MyButton
                  variant="primary"
                  startIcon={<FileDownloadIcon />}
                  onClick={() => {
                    showDialog({
                      title: "Select Export Format",
                      maxWidth: "xs",
                      content: (
                        <Stack spacing={2} mt={1}>
                          <MyButton
                            variant="primary"
                            startIcon={<DescriptionIcon />}
                            onClick={() => {
                              exportData(
                                formatPreviewCsvData(previewRestaurant),
                                "csv",
                                previewRestaurant.restaurantName,
                              );
                              showSnackbar(
                                "CSV downloaded successfully",
                                "success",
                              );
                            }}
                          >
                            Export as CSV
                          </MyButton>

                          <MyButton
                            variant="success"
                            startIcon={<TableChartIcon />}
                            onClick={() => {
                              exportRestaurantPreviewExcel(previewRestaurant);

                              showSnackbar(
                                "Excel downloaded successfully",
                                "success",
                              );
                            }}
                          >
                            Export as Excel
                          </MyButton>

                          <MyButton
                            variant="cancel"
                            startIcon={<PictureAsPdfIcon />}
                            onClick={async () => {
                              await exportPreviewAsPdf(
                                previewRef,
                                previewRestaurant.restaurantName,
                              );
                              showSnackbar(
                                "PDF downloaded successfully",
                                "success",
                              );
                            }}
                          >
                            Export as PDF
                          </MyButton>
                        </Stack>
                      ),
                    });
                  }}
                >
                  Download
                </MyButton>
              </Box>
            </Box>

            {/* Branches */}
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Branches
            </Typography>
            {previewRestaurant.branches?.length ? (
              previewRestaurant.branches.map((branch, bIndex) => (
                <Paper
                  key={bIndex}
                  elevation={2}
                  sx={{
                    p: 2,
                    mb: 2,
                    borderLeft: "4px solid #1976d2",
                    backgroundColor: "#f5f7fa",
                  }}
                >
                  <Typography fontWeight="bold">
                    {branch.branchName.toUpperCase()} ({branch.branchCode})
                  </Typography>

                  {/* Compliance Details */}
                  {branch.complianceDetails?.length ? (
                    <Box sx={{ mt: 1, ml: 2 }}>
                      <Typography fontWeight="bold" fontSize={14} mb={1}>
                        Compliance Details
                      </Typography>
                      {branch.complianceDetails.map((c, cIndex) => {
                        const isExpired = new Date(c.validTill) < new Date();
                        return (
                          <Box
                            key={cIndex}
                            sx={{
                              ml: 1,
                              mt: 0.5,
                              color: isExpired ? "error.main" : "text.primary",
                            }}
                          >
                            {c.licenseType.toUpperCase()} – {c.licenseNumber}{" "}
                            <br />
                            <small>
                              {new Date(c.validFrom).toLocaleDateString()} →{" "}
                              {new Date(c.validTill).toLocaleDateString()}
                              {isExpired ? " (Expired)" : ""}
                            </small>
                          </Box>
                        );
                      })}
                    </Box>
                  ) : (
                    <Typography ml={2} fontStyle="italic">
                      No compliance details
                    </Typography>
                  )}
                </Paper>
              ))
            ) : (
              <Typography fontStyle="italic" mb={2}>
                No branches available
              </Typography>
            )}

            {/* Menu Items */}
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Menu Items
            </Typography>
            {previewRestaurant.menuItems?.length ? (
              <Box
                display="grid"
                gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))"
                gap={2}
              >
                {previewRestaurant.menuItems.map((item, i) => (
                  <Paper
                    key={i}
                    elevation={1}
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      borderLeft: "4px solid #ff9800",
                    }}
                  >
                    <Typography fontWeight="bold">{item.itemName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Category: {item.category}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      Price: ₹{item.price}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            ) : (
              <Typography fontStyle="italic">
                No menu items available
              </Typography>
            )}
          </Box>
        )}
      </MyDialog>

      <MyDialog
        open={!!deleteRestaurant}
        onClose={() => setDeleteRestaurant(null)}
        maxWidth="xs"
      >
        <Typography textAlign="center">
          Are you sure you want to delete this restaurant?
        </Typography>

        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          sx={{ mt: 3 }}
        >
          <MyButton
            variant="outlined"
            onClick={() => setDeleteRestaurant(null)}
          >
            No
          </MyButton>

          <MyButton
            variant="cancel"
            onClick={async () => {
              if (!deleteRestaurant?.id) return;

              await removeRestaurantInfo(deleteRestaurant.id);
              setDeleteRestaurant(null);
            }}
          >
            Yes
          </MyButton>
        </Stack>
      </MyDialog>
    </Container>
  );
};

export default RestaurantInfoList;
