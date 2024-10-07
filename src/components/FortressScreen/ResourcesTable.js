import React from 'react';

const ResourcesTable = ({ resources }) => (
  <div className="resources-table">
    <h3>Resources</h3>
    {Object.entries(resources).map(([name, { amount, icon: Icon }]) => (
      <div key={name} className="resource-item">
        <Icon className="resource-icon" />
        <span>{name}: {amount}</span>
      </div>
    ))}
  </div>
);

export default ResourcesTable;