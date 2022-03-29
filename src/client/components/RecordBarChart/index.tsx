import ReactEcharts from "echarts-for-react";
import moment from "moment";

const minute = 60 * 1000;
const hour = 60 * minute;
const day = 24 * hour;

const Chart = ({
  title,
  data,
  xAxisMin = null,
  xAxisMax = null,
  dateType = 1, // 1: 過去一段時間     2: 自選日期
}: {
  title: string;
  data: any;
  xAxisMin?: any;
  xAxisMax?: any;
  dateType?: number;
}) => {
  let startTime: any = new Date(xAxisMin);
  const endTime: any = new Date(xAxisMax);
  const timeDiff = endTime - startTime;

  const timeFormat = dateType === 1 ? "HH:mm" : "YYYY-MM-DD";

  if (dateType > 1) {
    if (timeDiff <= 7 * day) {
      startTime.setDate(endTime.getDate() - 7);
    } else {
      startTime.setDate(startTime.getDate() - 1);
    }
  }

  const check = data.find((doc: any) => new Date(doc[0]) < startTime);
  if (check && check[0]) {
    startTime = new Date(check[0]);
  }

  const option = {
    color: ["#009C95", "#21ba45"],
    title: {
      text: title,
      textStyle: {
        fontFamily: "lato",
      },
    },
    tooltip: {
      trigger: "axis",
      formatter: (params: any) => {
        const value = params[0].value;
        return `
          <div className="tooltip">
            <table>
              <tr>
                <td style="padding:1px 5px;">time:</td>
                <td style="padding:1px 5px;">
                  ${moment(value[0]).format(timeFormat)}
                </td>
              </tr>
              <tr>
                <td style="padding:1px 5px;">count:</td>
                <td style="padding:1px 5px;">${value[1]}</td>
              </tr>
            </table>
          </div>
        `;
      },
    },
    calculable: true,
    xAxis: [
      {
        type: "time",
        boundaryGap: false,
        min: startTime,
        max: endTime,
        axisLabel: {
          formatter: function (value: any) {
            return moment(value).format(timeFormat);
          },
        },
      },
    ],
    yAxis: [{ type: "value" }],
    series: [
      {
        barMaxWidth: "50px",
        type: "bar",
        data,
      },
    ],
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center my-5">
        <span>無資料</span>
      </div>
    );
  }

  return <ReactEcharts option={option} />;
};

export default Chart;
