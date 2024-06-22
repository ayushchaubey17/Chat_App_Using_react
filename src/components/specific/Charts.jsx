import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  Tooltip,
  Filler,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Legend,
} from "chart.js";
import { lightPurple, orange, purple } from "../../constants/color";
import { getLastSevenDays } from "../../lib/Features";

ChartJS.register(
  CategoryScale,
  Tooltip,
  Filler,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Legend
);

const labels = getLastSevenDays();

const lineChartOptions = {
  respponsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        display: false,
      },
    },
  },
};

const LineChart = ({value=[]}) => {
  const data = {
    labels,
    datasets: [{
        data:value,
        label:"Messages",
        fill:true,
        backgroundColor:lightPurple,
        borderColor:purple
    }],
  };
  return <Line data={data} options={lineChartOptions} />;
};

const doughnutChartOptions = {
    respponsive:true,
    plugins:{
        legend:{
            display:false,
        },
    },
    cutout:120,
}

const DoughnutChart = ({value=[], labels=[]}) => {

    const data = {
        labels,
        datasets: [{
            data:value,
            
            fill:false,
            backgroundColor:[lightPurple,orange],
            borderColor:[purple,orange],
            offset:40,
        }],
      };

  return <Doughnut style={{zIndex:10}} data={data} options={doughnutChartOptions}/>
};
export { LineChart, DoughnutChart };
