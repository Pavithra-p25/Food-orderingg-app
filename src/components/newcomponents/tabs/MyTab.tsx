import React, { useEffect, useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";

export type TabStatus = "neutral" | "error" | "success";

export type TabConfig = {
  key: string; // unique tab identifier by key
  tabName: string; // tab label
  tabContent: React.ReactNode; // tab content
};

type MyTabsProps = {
  tabs: TabConfig[];
  activeTab?: number; // default active tab index
  onTabChange?: (index: number) => void; //call when tab changes
  tabStatus?: Record<string, TabStatus>; // optional
};

const MyTabs: React.FC<MyTabsProps> = ({
  tabs,
  activeTab = 0,
  onTabChange,
  tabStatus = {},
}) => {
  const [activeIndex, setActiveIndex] = useState(activeTab);

  useEffect(() => {
    setActiveIndex(activeTab); //when tab changes from parent , update tab automatically by index
  }, [activeTab]);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    //_event object , synthetic event - by using this event work on all browsers
    //instead of mouse event,keyboard event , synthetic wraps them
    setActiveIndex(newValue);
    onTabChange?.(newValue); // call parent only when tab changes
  };

  const getTabColor = (status?: TabStatus) => {
    switch (status) {
      case "error":
        return "red";
      case "success":
        return "green";
      default:
        return "inherit";
    }
  };

  return (
    <Box>
      {/* TAB HEADERS */}
      <Tabs
        value={activeIndex} // which tab is active
        onChange={handleChange}
        variant="scrollable" // allow scrolling when many tabs
        scrollButtons="auto" // show scroll buttons as needed
        aria-label="Form Tabs" //tell the screen reader what these tabs are for
        selectionFollowsFocus //enable keyboard navigation
        indicatorColor="primary"
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider", // full-width base line
          "& .MuiTabs-indicator": {
            height: 3,
            borderRadius: 2,
          },
        }}
      >
        {tabs.map((tab) => {
          const status = tabStatus[tab.key]; //receive validation status from parent

          return (
            <Tab
              key={tab.key}
              label={tab.tabName}
              sx={{
                color: getTabColor(status),
                fontWeight: status && status !== "neutral" ? 600 : 400,
                "&.Mui-selected": {
                  //apply styles only to selected tab
                  color: getTabColor(status),
                },
              }}
            />
          );
        })}
      </Tabs>

      {/* TAB CONTENT */}
      <Box mt={2}>{tabs[activeIndex]?.tabContent}</Box>
    </Box>
  );
};

export default MyTabs;
