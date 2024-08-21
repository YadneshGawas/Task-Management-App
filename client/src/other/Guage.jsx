/* eslint-disable no-unused-vars */
import * as React from 'react';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

const settings = {
  width: 200,
  height: 200,
  value: 60,
};

export default function Guage() {
  return (
    <Gauge
      {...settings}
      cornerRadius="50%"
      text={"Progress"}
      sx={(theme) => ({
        [`& .${gaugeClasses.valueText}`]: {
          fontSize: 30,
        },
        [`& .${gaugeClasses.valueArc}`]: {
          fill: '#52b202',
        },
        [`& .${gaugeClasses.referenceArc}`]: {
          fill: theme.palette.text.disabled,
        },
      })}
    />
  );
}
