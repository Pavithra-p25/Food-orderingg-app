import React, { useEffect, useState } from "react";
import { Tabs, Tab, Box, Badge } from "@mui/material";
import type { TabStatus } from "../../../types/restaurantTypes";
export interface TabConfig {
  tabName: string;
  tabContent: React.ReactNode;
}

interface MyTabsProps {
  tabs: TabConfig[];
  activeTab?: number;
  onTabChange?: (index: number) => void;
  tabStatus?: TabStatus[]; // optional status per tab
}

const MyTabs: React.FC<MyTabsProps> = ({
  tabs,
  activeTab = 0,
  onTabChange,
  tabStatus,
}) => {
  const [activeIndex, setActiveIndex] = useState(activeTab);

  useEffect(() => {
    setActiveIndex(activeTab);
  }, [activeTab]);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveIndex(newValue);
    onTabChange?.(newValue);
  };

  // Function to get badge color based on status
  const getBadgeColor = (status?: TabStatus) => {
    switch (status) {
      case "error":
        return "error";
      case "success":
        return "success";
      default:
        return "default"; // neutral
    }
  };

  return (
    <Box>
      {/* TAB HEADERS */}
      <Tabs value={activeIndex} onChange={handleChange} variant="scrollable" scrollButtons="auto">
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            label={
              tabStatus ? (
                <Badge
                  color={getBadgeColor(tabStatus[index])}
                  variant={tabStatus[index] === "neutral" ? "dot" : "standard"}
                  sx={{ mr: 1 }}
                >
                  {tab.tabName}
                </Badge>
              ) : (
                tab.tabName
              )
            }
          />
        ))}
      </Tabs>

      {/* TAB CONTENT */}
      <Box mt={2}>
        {tabs[activeIndex]?.tabContent}
      </Box>
    </Box>
  );
};

export default MyTabs;
