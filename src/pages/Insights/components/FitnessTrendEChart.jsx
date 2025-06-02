// src/pages/Insights/components/FitnessTrendEChart.jsx
import React from 'react';
import ReactECharts from 'echarts-for-react';

const FitnessTrendEChart = ({ data }) => {
  const dates = data.map((d) => d.name);
  const fitnessValues = data.map((d) => d.fitness);

  const option = {
    title: {
      text: 'Fitness Trend Over Time',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: dates,
    },
    yAxis: {
      type: 'value',
      name: 'Fitness Score',
    },
    series: [
      {
        data: fitnessValues,
        type: 'line',
        smooth: true,
        areaStyle: {
          color: '#3366cc',
        },
        lineStyle: {
          color: '#3366cc',
          width: 3,
        },
        showSymbol: false,
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: '300px', width: '100%' }} />;
};

export default FitnessTrendEChart;
