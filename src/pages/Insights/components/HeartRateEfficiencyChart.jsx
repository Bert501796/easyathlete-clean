// src/pages/Insights/components/HeartRateEfficiencyChart.jsx
import React from 'react';
import ReactECharts from 'echarts-for-react';

const HeartRateEfficiencyChart = ({ data }) => {
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    title: {
      text: 'Heart Rate Efficiency',
      left: 'center',
      textStyle: {
        fontSize: 18
      }
    },
    xAxis: {
      type: 'category',
      data: data.map((d) => d.name),
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      name: 'Speed / BPM'
    },
    series: [
      {
        name: 'HR Efficiency',
        type: 'line',
        data: data.map((d) => d.hrEfficiency),
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 3
        },
        areaStyle: {
          opacity: 0.2
        }
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: 300 }} />;
};

export default HeartRateEfficiencyChart;
