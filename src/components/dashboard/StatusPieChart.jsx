import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Card from '../ui/Card';

/**
 * StatusPieChart component for displaying status distribution as a pie chart
 * @param {Object} props - Component props
 * @param {Array} props.data - Array of data objects with 'name' and 'value' properties
 * @param {string} props.title - Chart title
 * @param {Array} [props.colors] - Optional array of colors for pie segments
 */
const StatusPieChart = ({ data, title, colors = ['#3b82f6', '#22c55e', '#ef4444', '#f59e0b'] }) => {
  if (!data || data.length === 0) {
    return (
      <Card title={title} className="h-full">
        <div className="flex items-center justify-center h-48 text-secondary-500">
          No data available
        </div>
      </Card>
    );
  }

  return (
    <Card title={title} className="h-full">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value}`, 'Count']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default StatusPieChart; 