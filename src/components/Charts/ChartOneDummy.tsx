import { ApexOptions } from 'apexcharts';
import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const options: ApexOptions = {
  legend: {
    show: false,
    position: 'top',
    horizontalAlign: 'left',
  },
  colors: ['#085709', '#87D789'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    height: 335,
    type: 'area',
    dropShadow: {
      enabled: true,
      color: '#623CEA14',
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },
    toolbar: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350,
        },
      },
    },
  ],
  stroke: {
    width: [2, 2],
    curve: 'smooth',
  },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 4,
    colors: '#fff',
    strokeColors: ['#085709', '#10AF13'],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    fillOpacity: 1,
    hover: {
      sizeOffset: 5,
    },
  },
  xaxis: {
    type: 'category',
    categories: [
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
      'Sun',
    ],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    title: {
      style: {
        fontSize: '0px',
      },
    },
    min: 0,
    max: 100,
  },
};

const ChartOneDummy: React.FC = () => {
  const [state] = useState({
    series: [
      {
        name: 'Intern',
        data: [12, 45, 67, 23, 89, 54, ],
      },
      {
        name: 'Part Time',
        data: [15, 35, 50, 65, 80, 20, ],
      },
    ],
  });

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-green-6">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-green-6"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-green-6">Intren</p>
              <p className="text-sm font-medium">12.04.2022 - 12.05.2022</p>
            </div>
          </div>
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-green-4">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-green-4"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-green-4">Part Time</p>
              <p className="text-sm font-medium">12.04.2022 - 12.05.2022</p>
            </div>
          </div>
        </div>
        <div className="flex w-full max-w-45 justify-end">
          <div className="inline-flex items-center rounded-md bg-whiter p-1.5">
            <button className="rounded bg-white py-1 px-3 text-xs font-medium text-black shadow-card hover:bg-white hover:shadow-card ">
              Day
            </button>
            <button className="rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card">
              Week
            </button>
            <button className="rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card">
              Month
            </button>
          </div>
        </div>
      </div>
      <div>
        <ReactApexChart
          options={options}
          series={state.series}
          type="area"
          height={350}
        />
      </div>
    </div>
  );
};

export default ChartOneDummy;
