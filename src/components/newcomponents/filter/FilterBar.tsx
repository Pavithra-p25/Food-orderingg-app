import React from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useFilter } from "../../../context/FilterContext";

const FilterBar: React.FC = () => {
  const {
    search,
    setSearch,
    category,
    setCategory,
    filterType,
    setFilterType,
    clearFilters,
  } = useFilter();

  return (
    <Box
      display="flex"
      flexWrap="wrap"
      gap={2}
      alignItems="center"
      mb={2}
    >
      {/* Search */}
      <TextField
        size="small"
        label="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Category */}
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Category</InputLabel>
        <Select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="veg">Veg</MenuItem>
          <MenuItem value="non-veg">Non-Veg</MenuItem>
        </Select>
      </FormControl>

      {/* Filter Type */}
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Filter</InputLabel>
        <Select
          label="Filter"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <MenuItem value="">None</MenuItem>
          <MenuItem value="priceLow">Price: Low → High</MenuItem>
          <MenuItem value="priceHigh">Price: High → Low</MenuItem>
        </Select>
      </FormControl>

      {/* Clear */}
      <Button variant="outlined" color="error" onClick={clearFilters}>
        Clear
      </Button>
    </Box>
  );
};

export default FilterBar;
