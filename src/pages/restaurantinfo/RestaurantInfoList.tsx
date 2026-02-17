import React, { useState, useEffect } from "react";
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
import { ExportRestaurantInfo } from "./ExportRestaurantInfo";
import { useDialogSnackbar } from "../../context/DialogSnackbarContext";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DescriptionIcon from "@mui/icons-material/Description";
import TableChartIcon from "@mui/icons-material/TableChart";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

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

  const { handleDelete } = useRestaurantListHandlers({
    setEditingRestaurant,
    setPreviewRestaurant,
    setDeleteRestaurant,
    deleteRestaurant,
  });

  useEffect(() => {
    fetchRestaurantInfo();
  }, []);

  const openExportDialog = (data: RestaurantInfoValues[], title: string) => {
    showDialog({
      title,
      maxWidth: "xs",
      content: (
        <Stack spacing={2} mt={1}>
          <MyButton
            variant="primary"
            startIcon={<DescriptionIcon />}
            onClick={() => {
              ExportRestaurantInfo(data, "csv");
              showSnackbar("CSV downloaded successfully", "success");
            }}
          >
            Export as CSV
          </MyButton>

          <MyButton
            variant="success"
            startIcon={<TableChartIcon />}
            onClick={() => {
              ExportRestaurantInfo(data, "excel");
              showSnackbar("Excel downloaded successfully", "success");
            }}
          >
            Export as Excel
          </MyButton>

          <MyButton
            variant="cancel"
            startIcon={<PictureAsPdfIcon />}
            onClick={() => {
              ExportRestaurantInfo(data, "pdf");
              showSnackbar("PDF downloaded successfully", "success");
            }}
          >
            Export as PDF
          </MyButton>
        </Stack>
      ),
    });
  };

  const handleRowExport = (row: RestaurantInfoValues) => {
    openExportDialog([row], row.restaurantName);
  };

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

          {/* Download */}
          <Tooltip title="Download">
            <IconButton color="info" onClick={() => handleRowExport(row)}>
              <FileDownloadIcon fontSize="small" />
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
                        ExportRestaurantInfo(restaurantInfoList, "csv");
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
                        ExportRestaurantInfo(restaurantInfoList, "excel");
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
                        ExportRestaurantInfo(restaurantInfoList, "pdf");
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
          <Box sx={{ p: 3 }}>
            {/* Restaurant Header */}
            <Box
              sx={{
                mb: 3,
                textAlign: "center",
                borderBottom: "2px solid #1976d2",
                pb: 2,
              }}
            >
              <Typography variant="subtitle1" color="text.primary" align="left">
                Owner: {previewRestaurant.ownerName.toUpperCase()}
              </Typography>
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
