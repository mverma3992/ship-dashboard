import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../ui/Card';

/**
 * JobsTrendChart component for displaying job trends over time
 * @param {Object} props - Component props
 * @param {Array} props.data - Array of data points with date and job counts
 * @param {string} props.title - Chart title
 * @param {Object} [props.lines] - Lines configuration with key as data field and value as color
 */
const JobsTrendChart = ({ 
  data, 
  title, 
  lines = {
    created: '#3b82f6',  // blue
    completed: '#22c55e', // green
    overdue: '#ef4444'    // red
  } 
}) => {
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
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            {Object.entries(lines).map(([key, color]) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={color}
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default JobsTrendChart; 