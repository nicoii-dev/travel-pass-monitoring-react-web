import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Legend,
} from 'chart.js';

const AdminGraph = ({
  lineGraphData,
  // eslint-disable-next-line react/prop-types
}) => {
  ChartJS.register(Title, Tooltip, LineElement, CategoryScale, LinearScale, PointElement, Filler, Legend);

  const [data, setData] = useState({
    labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        showLabel: true,
        data: lineGraphData?.map((data) => data.total),
        label: 'Applied LSI 2023',
        backgroundColor: '#E9F5FF',
        borderColor: '#1282A2',
        tension: 0.5,
        fill: true,
        display: false,
        showLine: true,
      },
    //   secondLineGraphData.length > 0
    //     ? {
    //         showLabel: true,
    //         label: secondLineGraphLabel,
    //         data: secondLineGraphData,
    //         fill: false,
    //         tension: 0.5,
    //         borderColor: '#FFFF00',
    //       }
    //     : null,
    ],
  });

  return <Line data={data} width={'100%'} sx={{ padding: 15 }} options={{ maintainAspectRatio: false }} />;
};

export default AdminGraph;
