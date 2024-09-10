type TChartConfgigParams = {
    isSelectionEnabled: boolean,
};

const getZapinChartConfig = (chartConfigParams: TChartConfgigParams) => ({
  annotations: {
    xaxis: [
      {
        x: '9.5',
        borderColor: '#0497EC',
        borderWidth: 2,
        label: {
          borderColor: '#0497EC',
          orientation: 'horizontal',
        },
      },
    ],
  },
  chart: {
    id: 'chart1',
    width: '100%',
    type: 'bar',
    foreColor: '#ccc',
    parentHeightOffset: 50,
    brush: {
      target: 'chart2',
      enabled: true,
    },
    fill: {
      opacity: 0.2,
    },
    selection: {
      enabled: chartConfigParams.isSelectionEnabled ?? false,
      fill: {
        color: '#fff',
        opacity: 0.4,
      },
      stroke: {
        width: 3,
        color: '#0497EC',
        opacity: 1,
      },
      xaxis: {
        min: 0,
        max: 0,
      },
    },
  },
  fill: {
    opacity: 0.9,
    type: 'solid',
  },
  colors: ['#FF008044'],
  series: [
    {
      data: [],
    },
  ],
  stroke: {
    width: 2,
  },
  grid: {
    borderColor: '#E3F2FD',
    show: false,
    padding: {
      top: 0, bottom: 20,
    },
  },
  markers: {
    size: 0,
  },
  xaxis: {
    labels: {
      style: {
        colors: '#687386',
        fontSize: '14px',
      },
    } as any,
  },
  yaxis: {
    tickAmount: 2,
  },
});

export default getZapinChartConfig;
