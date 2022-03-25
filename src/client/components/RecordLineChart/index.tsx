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
    tooltip: {
      trigger: "axis",
      formatter: (params: any) => {
        const axisValue = params[0].axisValue;
        const value = params[0].value;
        return `
          <div className="tooltip">
            <table>
              <tr>
                <td style="padding:1px 5px;">time:</td>
                <td style="padding:1px 5px;">${axisValue}</td>
              </tr>
              <tr>
                <td style="padding:1px 5px;">count:</td>
                <td style="padding:1px 5px;">${value}</td>
              </tr>
            </table>
          </div>
        `;
      },
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
