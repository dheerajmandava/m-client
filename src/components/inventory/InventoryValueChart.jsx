'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function InventoryValueChart({ timeframe = 30 }) {
  const { data: valueHistory, isLoading } = useQuery({
    queryKey: ['inventory-value-history', timeframe],
    queryFn: () => api.getInventoryValueHistory(timeframe)
  });

  if (isLoading) {
    return <div className="h-[300px] flex items-center justify-center">Loading...</div>;
  }

  const chartData = {
    labels: valueHistory.map(item => 
      new Date(item.date).toLocaleDateString()
    ) || [],
    datasets: [
      {
        label: 'Total Value',
        data: valueHistory.map(item => item.totalValue) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3
      },
      {
        label: 'Cost Value',
        data: valueHistory.map(item => item.costValue) || [],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        tension: 0.3
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toFixed(2);
          }
        }
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Value Trends</CardTitle>
        <CardDescription>
          Track your inventory value over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Line data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
} 