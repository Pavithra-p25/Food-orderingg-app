import React, { useState, useEffect } from "react";
import "./MyTab.css";

export interface TabConfig {
  tabName: string; //text shown in tab header("lpgin details")
  tabContent: React.ReactNode; //content shown when the tab is active(<Loginform/>)
}

interface MyTabsProps {
  tabs: TabConfig[]; //all tabs with name content
  activeTab?: number; // which tab is active (index)
  onTabChange?: (index: number) => void; // callback when tab is clicked
}

const MyTabs: React.FC<MyTabsProps> = ({
  tabs,
  activeTab = 0, //default first tab
  onTabChange,
}) => {
  const [activeIndex, setActiveIndex] = useState(activeTab);


  useEffect(() => {
    setActiveIndex(activeTab);
  }, [activeTab]);

  if (!tabs.length) return <div>No tabs to display</div>; 

  const handleChange = (index: number) => {
    setActiveIndex(index);
    onTabChange?.(index); // call if function only exits
  };

  return (
    <div className="my-tab-wrapper">
      {/* TAB HEADERS */}
      <div className="my-tab-container">
        {tabs.map((tab, index) => ( //loops through each tab ,create a clickable div per tab
          <div
            key={index}
            className={`my-tab-item ${
              activeIndex === index ? "active" : "" // if there index the tab become my-tab-item-active / my-tab-item
            }`}
            onClick={() => handleChange(index)}
          >
            {tab.tabName}
          </div>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="my-tab-content">
        {tabs[activeIndex]?.tabContent}
      </div>
    </div>
  );
};

export default MyTabs;
