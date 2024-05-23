import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, axisClasses } from '@mui/x-charts';
import { useEffect, useState } from 'react';
import axios from 'axios';

import Title from './Title';

// function createData(time, amount) {
//   return { time, amount: amount ?? null };
// }

// const data = [
//   createData('00:00', 0),
//   createData('03:00', 300),
//   createData('06:00', 600),
//   createData('09:00', 800),
//   createData('12:00', 1500),
//   createData('15:00', 2000),
//   createData('18:00', 2400),
//   createData('21:00', 2400),
//   createData('24:00'),
// ];

export default function Chart() {
  const theme = useTheme();

  const [data,setData] = useState([]);

  useEffect(() => {
    axios.get(import.meta.env.VITE_SERVER_URL+'/history/temperature')
      .then((response) => {
        const parsedData = response.data.map(entry => ({
          time: new Date(entry.time),
          temp: parseFloat(entry.temp)
        }));
        setData(parsedData);
      })
      .catch((error) => {
        console.error('Error fetching temperature data:', error);
      });
  }, []);

  return (
    <React.Fragment>
      <Title>Today</Title>
      <div style={{ width: '100%', flexGrow: 1, overflow: 'hidden' }}>
        <LineChart
          dataset={data}
          margin={{
            top: 16,
            right: 20,
            left: 70,
            bottom: 30,
          }}
          xAxis={[
            {
              scaleType: 'point',
              dataKey: 'time',
              tickNumber: 2,
              tickLabelStyle: theme.typography.body2,
            },
          ]}
          yAxis={[
            {
              label: 'Temperature (in C)',
              labelStyle: {
                ...theme.typography.body1,
                fill: theme.palette.text.primary,
              },
              tickLabelStyle: theme.typography.body2,
              min: 0,
              max: 50,
              tickNumber: 3,
            },
          ]}
          series={[
            {
              dataKey: 'temp',
              showMark: false,
              color: theme.palette.primary.light,
            },
          ]}
          sx={{
            [`.${axisClasses.root} line`]: { stroke: theme.palette.text.secondary },
            [`.${axisClasses.root} text`]: { fill: theme.palette.text.secondary },
            [`& .${axisClasses.left} .${axisClasses.label}`]: {
              transform: 'translateX(-25px)',
            },
          }}
        />
      </div>
    </React.Fragment>
  );
}