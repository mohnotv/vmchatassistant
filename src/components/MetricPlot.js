import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './MetricPlot.css';

export default function MetricPlot({ chartData }) {
  const [enlarged, setEnlarged] = useState(false);

  if (!chartData || !chartData.data || chartData.data.length === 0) return null;

  const { data, metric_field } = chartData;
  const formattedData = data.map(d => ({
    date: d.date.toLocaleDateString(),
    value: d.value,
    title: d.title
  }));

  const ChartContent = () => (
    <ResponsiveContainer width="100%" height={enlarged ? 500 : 300}>
      <LineChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
        <XAxis 
          dataKey="date" 
          stroke="rgba(255, 255, 255, 0.6)"
          tick={{ fill: 'rgba(255, 255, 255, 0.6)' }}
        />
        <YAxis 
          stroke="rgba(255, 255, 255, 0.6)"
          tick={{ fill: 'rgba(255, 255, 255, 0.6)' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.9)', 
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white'
          }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke="#4CAF50" 
          strokeWidth={2}
          name={metric_field}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const downloadChart = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`${metric_field} over Time`, 50, 50);
    
    const link = document.createElement('a');
    link.download = `${metric_field}_vs_time.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <>
      <div className="metric-plot-container">
        <div className="metric-plot-header">
          <h3 className="metric-plot-title">{metric_field} over Time</h3>
          <div className="metric-plot-actions">
            <button 
              className="metric-plot-btn"
              onClick={() => setEnlarged(true)}
              title="Enlarge"
            >
              🔍
            </button>
            <button 
              className="metric-plot-btn"
              onClick={downloadChart}
              title="Download"
            >
              ⬇️
            </button>
          </div>
        </div>
        <div className="metric-plot-chart">
          <ChartContent />
        </div>
      </div>

      {enlarged && (
        <div className="metric-plot-overlay" onClick={() => setEnlarged(false)}>
          <div className="metric-plot-enlarged" onClick={(e) => e.stopPropagation()}>
            <button className="metric-plot-close" onClick={() => setEnlarged(false)}>×</button>
            <h2>{metric_field} over Time</h2>
            <div className="metric-plot-enlarged-chart">
              <ChartContent />
            </div>
            <button className="metric-plot-download-btn" onClick={downloadChart}>
              Download Chart
            </button>
          </div>
        </div>
      )}
    </>
  );
}
