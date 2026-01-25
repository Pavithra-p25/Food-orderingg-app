import React from "react";
import { Box, Grid, Typography, IconButton, Tooltip } from "@mui/material";
import StoreIcon from "@mui/icons-material/Store";
import AddIcon from "@mui/icons-material/Add";
import DescriptionIcon from "@mui/icons-material/Description";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useFieldArray, useFormContext } from "react-hook-form";
import MyInput from "../../components/newcomponents/textfields/MyInput";
import MyButton from "../../components/newcomponents/button/MyButton";
import MyAccordion from "../../components/newcomponents/accordian/MyAccordion";
import MyDatePicker from "../../components/newcomponents/datepicker/MyDatePicker";
import { formatDate } from "../../utils/DateUtils";
import type { RestaurantInfoValues } from "../../types/RestaurantInfoTypes";
import type { Control, FieldErrors, UseFieldArrayReturn, UseFormTrigger } from "react-hook-form";
import MyTable from "../../components/newcomponents/table/MyTable";

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
  const complianceArray = useFieldArray({
    control,
    name: `branches.${branchIndex}.complianceDetails`,
  });

  const { watch } = useFormContext<RestaurantInfoValues>();
  const [complianceEditable, setComplianceEditable] = React.useState<boolean[]>(
    complianceArray.fields.map(() => true),
  );

  // Add Branch
  const addBranch = async () => {
    if (branchArray.fields.length >= 3) return;
    const valid = await trigger("branches");
    if (valid) {
      const newIndex = branchArray.fields.length;
      branchArray.append({
        branchName: "",
        branchCode: "",
        complianceDetails: [{ licenseType: "", licenseNumber: "", validFrom: "", validTill: "" }],
      });
      onBranchAdded(newIndex);
    }
  };

  // Add License
  const addLicense = async () => {
    if (complianceArray.fields.length >= 3) return;
    const valid = await trigger(`branches.${branchIndex}.complianceDetails`);
    if (valid) {
      complianceArray.append({ licenseType: "", licenseNumber: "", validFrom: "", validTill: "" });
      setComplianceEditable((prev) => [...prev, true]);
    }
  };

  const handleSaveCompliance = async (index: number) => {
    const valid = await trigger([
      `branches.${branchIndex}.complianceDetails.${index}.licenseType`,
      `branches.${branchIndex}.complianceDetails.${index}.licenseNumber`,
      `branches.${branchIndex}.complianceDetails.${index}.validFrom`,
      `branches.${branchIndex}.complianceDetails.${index}.validTill`,
    ]);

    if (valid) {
      setComplianceEditable((prev) =>
        prev.map((v, i) => (i === index ? false : v)),
      );
    }
  };

  const handleEditCompliance = (index: number) => {
    setComplianceEditable((prev) =>
      prev.map((v, i) => (i === index ? true : v)),
    );
  };

  const complianceRows = complianceArray.fields.map((field, index) => ({
    id: field.id,
    _index: index,
  }));

  const complianceColumns = [
    {
      id: "licenseType",
      label: "License Type",
      render: (row: ComplianceRow) =>
        complianceEditable[row._index] ? (
          <MyInput<RestaurantInfoValues>
            name={`branches.${branchIndex}.complianceDetails.${row._index}.licenseType`}
            size="small"
            control={control}
            required
            errorMessage={
              errors.branches?.[branchIndex]?.complianceDetails?.[row._index]?.licenseType?.message
            }
          />
        ) : (
          <Typography fontWeight={600}>
            {watch(`branches.${branchIndex}.complianceDetails.${row._index}.licenseType`) || "-"}
          </Typography>
        ),
    },
    {
      id: "licenseNumber",
      label: "License Number",
      render: (row: ComplianceRow) =>
        complianceEditable[row._index] ? (
          <MyInput<RestaurantInfoValues>
            name={`branches.${branchIndex}.complianceDetails.${row._index}.licenseNumber`}
            size="small"
            control={control}
            required
            errorMessage={
              errors.branches?.[branchIndex]?.complianceDetails?.[row._index]?.licenseNumber?.message
            }
          />
        ) : (
          <Typography fontWeight={600}>
            {watch(`branches.${branchIndex}.complianceDetails.${row._index}.licenseNumber`) || "-"}
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
            {formatDate(watch(`branches.${branchIndex}.complianceDetails.${row._index}.validFrom`))}
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
            {formatDate(watch(`branches.${branchIndex}.complianceDetails.${row._index}.validTill`))}
          </Typography>
        ),
    },
    {
      id: "actions",
      label: "Actions",
      sortable: false,
      render: (row: ComplianceRow) => (
        <Box display="flex" gap={1} justifyContent="center">
          {complianceEditable[row._index] ? (
            <Tooltip title="Save">
              <IconButton color="success" onClick={() => handleSaveCompliance(row._index)}>
                <CheckIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Edit">
              <IconButton color="primary" onClick={() => handleEditCompliance(row._index)}>
                <EditNoteIcon />
              </IconButton>
            </Tooltip>
          )}
          <IconButton
            color="error"
            disabled={complianceArray.fields.length === 1}
            onClick={() => {
              complianceArray.remove(row._index);
              setComplianceEditable((prev) => prev.filter((_, i) => i !== row._index));
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <MyAccordion expanded={expanded} onChange={onToggle} sx={{ mb: 2 }}
      summary={
        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
          <Box display="flex" alignItems="center" gap={1}>
            <StoreIcon color="secondary" />
            <Typography fontWeight={600}>Branch Details {branchIndex + 1}</Typography>
          </Box>
          {branchIndex === branchArray.fields.length - 1 && (
            <MyButton variant="outlined" onClick={(e) => { e.stopPropagation(); addBranch(); }} disabled={branchArray.fields.length >= 3}>
              <AddIcon sx={{ mr: 0.5 }} /> Add Branch
            </MyButton>
          )}
        </Box>
      }
    >
      <Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <MyInput<RestaurantInfoValues>
              name={`branches.${branchIndex}.branchName`}
              control={control}
              label="Branch Name"
              required
              errorMessage={errors.branches?.[branchIndex]?.branchName?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <MyInput<RestaurantInfoValues>
              name={`branches.${branchIndex}.branchCode`}
              control={control}
              label="Branch Code"
              required
              errorMessage={errors.branches?.[branchIndex]?.branchCode?.message}
            />
          </Grid>
        </Grid>

        <Box mt={3}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box display="flex" gap={1} alignItems="center">
              <DescriptionIcon color="secondary" />
              <Typography fontWeight={700}>Compliance Details</Typography>
            </Box>
            <MyButton variant="outlined" onClick={addLicense} disabled={complianceArray.fields.length >= 3}>
              <AddIcon sx={{ mr: 0.5 }} /> Add License
            </MyButton>
          </Box>

          <Box>
            {/* Table Component */}
            <MyTable
              variant="editable"
              columns={complianceColumns}
              rows={complianceRows}
              pagination={false}
              dense={false}
            />
          </Box>
        </Box>

        {branchArray.fields.length > 1 && (
          <Box mt={2}>
            <MyButton variant="outlined-cancel" onClick={() => branchArray.remove(branchIndex)}>
              Remove Branch
            </MyButton>
          </Box>
        )}
      </Box>
    </MyAccordion>
  );
};

export default BranchAccordion;
