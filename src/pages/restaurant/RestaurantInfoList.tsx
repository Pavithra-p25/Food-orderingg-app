import React, { useState, useEffect } from "react";
import { Container, Paper, Box, Typography } from "@mui/material";
import MyTable from "../../components/newcomponents/table/MyTable";
import { useRestaurantInfo } from "../../hooks/useRestaurantInfo";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import EditNoteIcon from "@mui/icons-material/EditNote";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RestaurantInfo from "./RestaurantInfo";
import type { RestaurantInfoValues } from "../../types/RestaurantInfoTypes";
import MyDialog from "../../components/newcomponents/dialog/MyDialog";

const RestaurantInfoList = () => {
  const { restaurantInfoList, fetchRestaurantInfo, editRestaurantInfo } =
    useRestaurantInfo();

  const [editingRestaurant, setEditingRestaurant] = useState<any>(null);
  const [previewRestaurant, setPreviewRestaurant] =
    React.useState<RestaurantInfoValues | null>(null);

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
      render: (row: any) => row.branches?.length ?? 0 , align:"center" as const,
    },
    {
      id: "menuItems",
      label: "Menu Items",
      render: (row: any) => row.menuItems?.length ?? 0, align:"center" as const,
    },
    {
      id: "actions",
      label: "Actions",
      sortable: false,
      render: (row: any) => (
        <Box display="flex" gap={1} justifyContent="center">
          {/* Edit Button */}
          <Tooltip title="Edit">
            <IconButton
              color="primary"
              onClick={() => setEditingRestaurant(row)}
            >
              <EditNoteIcon />
            </IconButton>
          </Tooltip>

          {/* Preview Button */}
          <Tooltip title="Preview">
            <IconButton
              color="secondary"
              onClick={() => setPreviewRestaurant(row)}
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  // If a restaurant is being edited, render the form

  if (editingRestaurant) {
    return (
      <RestaurantInfo
        restaurantData={editingRestaurant}
        editRestaurantInfo={editRestaurantInfo} // pass it here
        onUpdateSuccess={() => {
          fetchRestaurantInfo(); // refresh table
          setEditingRestaurant(null); // close form
        }}
      />
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h6" fontWeight="bold" mb={3} textAlign="center">
          Submitted Restaurant Details
        </Typography>

        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <Box sx={{ minWidth: 650 }}>
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
        title={previewRestaurant?.restaurantName || "Preview"}
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
                Owner: {previewRestaurant.ownerName}
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
                    {branch.branchName} ({branch.branchCode})
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
                            • {c.licenseType.toUpperCase()} – {c.licenseNumber}{" "}
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
    </Container>
  );
};

export default RestaurantInfoList;
