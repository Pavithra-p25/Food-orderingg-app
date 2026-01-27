import React from "react";
import { Box, Grid, Typography, IconButton, Tooltip } from "@mui/material";
import StoreIcon from "@mui/icons-material/Store";
import AddIcon from "@mui/icons-material/Add";
import DescriptionIcon from "@mui/icons-material/Description";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useFormContext } from "react-hook-form";
import MyInput from "../../components/newcomponents/textfields/MyInput";
import MyButton from "../../components/newcomponents/button/MyButton";
import MyAccordion from "../../components/newcomponents/accordian/MyAccordion";
import MyDatePicker from "../../components/newcomponents/datepicker/MyDatePicker";
import MyTable from "../../components/newcomponents/table/MyTable";
import { formatDate } from "../../utils/DateUtils";
import type {
  Control,
  FieldError,
  FieldErrors,
  UseFieldArrayReturn,
  UseFormTrigger,
} from "react-hook-form";
import type { RestaurantInfoValues } from "../../types/RestaurantInfoTypes";
import {
  useBranchAccordionHandlers,
  useComplianceAccordionHandlers,
} from "../../hooks/useBranchHandlers";

type BranchAccordionProps = {
  branchIndex: number;
  control: Control<RestaurantInfoValues>;
  branchArray: UseFieldArrayReturn<RestaurantInfoValues, "branches">;
  errors: FieldErrors<RestaurantInfoValues>;
  trigger: UseFormTrigger<RestaurantInfoValues>;
  expanded: boolean;
  onToggle: () => void;
  onBranchAdded: (index: number) => void;
};

type ComplianceRow = {
  id: string;
  _index: number;
};

const BranchAccordion: React.FC<BranchAccordionProps> = ({
  branchIndex,
  control,
  branchArray,
  errors,
  trigger,
  expanded,
  onToggle,
  onBranchAdded,
}) => {
  const { watch } = useFormContext<RestaurantInfoValues>();

  const [openErrorRow, setOpenErrorRow] = React.useState<number | null>(null);

  /*  HANDLERS */
  const { addBranch, removeBranch } = useBranchAccordionHandlers(
    branchArray,
    trigger,
    onBranchAdded,
  );

  const {
    complianceArray,
    complianceEditable,
    addLicense,
    saveLicense,
    editLicense,
    removeLicense,
  } = useComplianceAccordionHandlers(control, branchIndex, trigger);

  /* TABLE DATA */
  const complianceRows: ComplianceRow[] = complianceArray.fields.map(
    (field, index) => ({
      id: field.id,
      _index: index,
    }),
  );

  const complianceColumns = [
    {
      id: "licenseType",
      label: "License Type",
      render: (row: ComplianceRow) =>
        complianceEditable[row._index] ? (
          <MyInput
            name={`branches.${branchIndex}.complianceDetails.${row._index}.licenseType`}
            size="small"
            required
            error={Boolean(
              errors.branches?.[branchIndex]?.complianceDetails?.[row._index]
                ?.licenseType,
            )}
          />
        ) : (
          <Typography fontWeight={600}>
            {watch(
              `branches.${branchIndex}.complianceDetails.${row._index}.licenseType`,
            ) || "-"}
          </Typography>
        ),
    },
    {
      id: "licenseNumber",
      label: "License Number",
      render: (row: ComplianceRow) =>
        complianceEditable[row._index] ? (
          <MyInput
            name={`branches.${branchIndex}.complianceDetails.${row._index}.licenseNumber`}
            size="small"
            required
            error={Boolean(
              errors.branches?.[branchIndex]?.complianceDetails?.[row._index]
                ?.licenseNumber,
            )}
          />
        ) : (
          <Typography fontWeight={600}>
            {watch(
              `branches.${branchIndex}.complianceDetails.${row._index}.licenseNumber`,
            ) || "-"}
          </Typography>
        ),
    },
    {
      id: "validFrom",
      label: "Valid From",
      render: (row: ComplianceRow) =>
        complianceEditable[row._index] ? (
          <MyDatePicker
            name={`branches.${branchIndex}.complianceDetails.${row._index}.validFrom`}
            size="small"
          />
        ) : (
          <Typography fontWeight={600}>
            {formatDate(
              watch(
                `branches.${branchIndex}.complianceDetails.${row._index}.validFrom`,
              ),
            )}
          </Typography>
        ),
    },
    {
      id: "validTill",
      label: "Valid Till",
      render: (row: ComplianceRow) =>
        complianceEditable[row._index] ? (
          <MyDatePicker
            name={`branches.${branchIndex}.complianceDetails.${row._index}.validTill`}
            size="small"
          />
        ) : (
          <Typography fontWeight={600}>
            {formatDate(
              watch(
                `branches.${branchIndex}.complianceDetails.${row._index}.validTill`,
              ),
            )}
          </Typography>
        ),
    },
    {
      id: "actions",
      label: "Actions",
      sortable: false,
      sx: {
        position: "sticky",
        right: 0,
        backgroundColor: "white",
        zIndex: 2,
        minWidth: 120,
      },
      render: (row: ComplianceRow) => {
       

        return (
          <Box display="flex" gap={1} justifyContent="center">
            {complianceEditable[row._index] ? (
              <Tooltip title="Save">
                <IconButton
                  color="success"
                  onClick={() => saveLicense(row._index)}
                >
                  <CheckIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Edit">
                <IconButton
                  color="primary"
                  onClick={() => editLicense(row._index)}
                >
                  <EditNoteIcon />
                </IconButton>
              </Tooltip>
            )}

            <IconButton
              color="error"
              disabled={complianceArray.fields.length === 1}
              onClick={() => removeLicense(row._index)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  return (
    <MyAccordion
      expanded={expanded}
      onChange={onToggle}
      sx={{ mb: 2 }}
      summary={
        <Box
          display="flex"
          flexWrap="wrap"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          width="100%"
          gap={1}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <StoreIcon color="secondary" />
            <Typography fontWeight={600}>
              Branch Details {branchIndex + 1}
            </Typography>
          </Box>

          {branchIndex === branchArray.fields.length - 1 && (
            <MyButton
              variant="outlined"
              onClick={(e) => {
                e.stopPropagation();
                addBranch();
              }}
              disabled={branchArray.fields.length >= 3}
            >
              <AddIcon sx={{ mr: 0.5 }} /> Branch
            </MyButton>
          )}
        </Box>
      }
    >
      <Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <MyInput
              name={`branches.${branchIndex}.branchName`}
              size="small"
              label="Branch Name"
              required
              errorMessage={errors.branches?.[branchIndex]?.branchName?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <MyInput
              name={`branches.${branchIndex}.branchCode`}
              size="small"
              label="Branch Code"
              required
              errorMessage={errors.branches?.[branchIndex]?.branchCode?.message}
            />
          </Grid>
        </Grid>

        {/* Compliance */}
        <Box mt={3}>
          <Box
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            mb={2}
            gap={1}
          >
            <Box display="flex" gap={1} alignItems="center">
              <DescriptionIcon color="secondary" />
              <Typography fontWeight={700}>Compliance Details</Typography>
            </Box>

            <MyButton
              variant="outlined"
              onClick={addLicense}
              disabled={complianceArray.fields.length >= 3}
            >
              <AddIcon sx={{ mr: 0.5 }} /> License
            </MyButton>
          </Box>

          <Box
            sx={{
              width: "100%",
              overflowX: "auto",
              WebkitOverflowScrolling: "touch", // smooth scroll on mobile
            }}
          >
            <Box sx={{ minWidth: 800 }}>
              <MyTable
                variant="editable"
                columns={complianceColumns}
                rows={complianceRows}
                pagination={false}
                dense={false}
                scrollable
              />
            </Box>
          </Box>
        </Box>
        {complianceRows.map((row) => {
          const rowErrors =
            errors.branches?.[branchIndex]?.complianceDetails?.[row._index];

          const messages: string[] = rowErrors
            ? Object.values(rowErrors)
                .filter(
                  (e): e is FieldError =>
                    typeof e === "object" && "message" in e,
                )
                .map((e) => e.message)
                .filter((msg): msg is string => Boolean(msg))
            : [];

          const isOpen = openErrorRow === row._index;

          if (messages.length === 0) return null;

          return (
            <Box key={`error-row-${row._index}`}>
              <Box
                onClick={() => setOpenErrorRow(isOpen ? null : row._index)}
                sx={{
                  px: 2,
                  py: 1,
                  cursor: "pointer",
                  color: "red",
                  fontSize: 13,
                  fontWeight: 500,
                  borderBottom: "1px solid #f2caca",
                }}
              >
                ❌ {messages.length} error{messages.length > 1 && "s"} found{" "}
                {isOpen ? "▴" : "▾"}
              </Box>

              {isOpen && (
                <Box
                  sx={{
                    px: 3,
                    py: 1,
                    backgroundColor: "#fff5f5",
                    borderBottom: "1px solid red",
                  }}
                >
                  {messages.map((msg, i) => (
                    <Typography
                      key={i}
                      sx={{ color: "red", fontSize: 13, mb: 0.5 }}
                    >
                      • {msg}
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>
          );
        })}

        {branchArray.fields.length > 1 && (
          <Box mt={2}>
            <MyButton
              variant="outlined-cancel"
              onClick={() => removeBranch(branchIndex)}
            >
              Remove Branch
            </MyButton>
          </Box>
        )}
      </Box>
    </MyAccordion>
  );
};

export default BranchAccordion;
