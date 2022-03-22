import ReactEcharts from "echarts-for-react";

const Chart = ({
  title,
  xAxisData,
  yAxisData,
}: {
  title: string;
  xAxisData: any;
  yAxisData: any;
}) => {
  const option = {
    title: {
      text: title,
    },
    xAxis: {
      name: "time",
      data: xAxisData,
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      name: "count",
    },
    series: [
      {
        data: yAxisData,
        type: "line",
      },
    ],
  };

  if (
    !yAxisData ||
    !xAxisData ||
    yAxisData.length === 0 ||
    xAxisData.length === 0 ||
    yAxisData.length !== xAxisData.length
  ) {
    return (
      <div className="flex justify-center my-5">
        <span>無資料</span>
      </div>
    );
  }

  return <ReactEcharts option={option} />;
};

export default Chart;
