import React from "react";

const AnalyticsCard = ({ title, value }) => {
  return (
    <div className="bg-white p-6 rounded shadow text-center">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
};

export default AnalyticsCard;
