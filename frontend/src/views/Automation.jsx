import React, { useState, useEffect } from 'react';
import Tabs from '../components/Tabs';
import AutomationInstance from '../components/Automation'; // The Automation component for individual instances

const Automation = () => {
  const [tabs, setTabs] = useState([]);

  // Load tabs from localStorage on component mount
  useEffect(() => {
    const savedTabs = localStorage.getItem('automation-tabs');
    if (savedTabs) {
      setTabs(JSON.parse(savedTabs));
    } else {
      // If no tabs are saved, initialize with a default tab
      setTabs([{ id: 'automation1', label: 'Automation 1' }]);
    }
  }, []);

  // Save tabs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('automation-tabs', JSON.stringify(tabs));
  }, [tabs]);

  // Function to render the content of each tab
  const renderTabContent = (tab) => {
    return <AutomationInstance instanceId={tab.id} />;
  };

  // Function to handle adding new tabs
  const handleAddTab = () => {
    const newTabId = `automation${tabs.length + 1}`;
    const newTab = { id: newTabId, label: `Automation ${tabs.length + 1}` };
    setTabs((prevTabs) => [...prevTabs, newTab]);
    return newTab;
  };

  return (
    <Tabs
      tabs={tabs} // Pass the current tabs state
      renderTabContent={renderTabContent}
      onAddTab={handleAddTab}
    />
  );
};

export default Automation;