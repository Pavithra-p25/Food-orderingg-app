import React, { createContext, useContext, useState } from "react";

interface FilterContextType {
  search: string;
  setSearch: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  filterType: string;
  setFilterType: (value: string) => void;
  clearFilters: () => void;
}

// Create context
const FilterContext = createContext<FilterContextType | undefined>(undefined);

// Define explicit props type for provider
interface FilterProviderProps {
  children: React.ReactNode;
}

// Provider component
export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [filterType, setFilterType] = useState("");

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setFilterType("");
  };

  return (
    <FilterContext.Provider
      value={{ search, setSearch, category, setCategory, filterType, setFilterType, clearFilters }}
    >
      {children}
    </FilterContext.Provider>
  );
};

// Custom hook to use the filter context
export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) throw new Error("useFilter must be used within FilterProvider");
  return context;
};
