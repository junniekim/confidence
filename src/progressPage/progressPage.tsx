import TitleHeader from "../Shared/titleHeader/titleHeader";
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Chart } from "react-google-charts";
import { useUser } from "../SesssionManager/session";
import "./progressPage.css";
import Swal from "sweetalert2";

export const bodyWeightOptions = {
  title: "Body weight change",
  curveType: "function",
  legend: "none",
  vAxis: {
    title: "Body Weight (Ibs)",
  },
  titleTextStyle: {
    fontSize: 18,
  },
  hAxis: {
    title: "Day",
  },
  pointSize: 5,
};
// export const weightLiftingOptions = {
//   title: "Max weight change",
//   curveType: "function",
//   legend: "none",
//   vAxis: {
//     title: "Body Weight (Ibs)",
//   },
//   titleTextStyle: {
//     fontSize: 18,
//   },
//   hAxis: {
//     title: "Day",
//   },
//   pointSize: 5,
// };

//soon as page loads, I need a list of body weight with date and number
//Also need a list of workout, date, weight

const ProgressPage = () => {
  const [userProgress, setUserProgress] = useState<any>(null);
  const [bodyWeightData, setBodyWeightData] = useState<any>(null);
  // const [weightLiftingData, setWeightLiftingData] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<String>(
    new Date().toLocaleString("en-US", { month: "long", year: "numeric" })
  );
  const base_url = import.meta.env.VITE_BASE_URL;
  const { user } = useUser();
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const currentUser = user || (storedUser ? JSON.parse(storedUser) : null);
    const query = `${base_url}/user/data/analyze/${currentUser.id}`;
    fetch(query)
      .then((response) => {
        if (!response.ok) {
          return response.json().then((error) => {
            throw error.error;
          });
        }
        return response.json();
      })
      .then((data) => {
        setUserProgress(data.data.progress);
      })
      .catch((error) => {
        Swal.fire(
          error || "Something went wrong",
          "Please try again at a later time.",
          "error"
        );
      });
  }, []);

  const onChange = (date: any) => {
    let bodyGraphInput: any[] = [];
    setSelectedDate(
      //03-01-2024
      date.toLocaleString("en-US", { month: "long", year: "numeric" })
    );
    console.log(userProgress);
    userProgress.filter((element: any) => {
      if (
        new Date(element.recordedOn)
          .toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
          })
          .replace(/\//g, "-") ===
        date
          .toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
          })
          .replace(/\//g, "-")
      ) {
        bodyGraphInput.push([
          Number(
            new Date(element.recordedOn).toLocaleString("en-US", {
              day: "numeric",
            })
          ) + 1,
          element.weight,
        ]);
        bodyGraphInput.sort((a, b) => a[0] - b[0]);
        bodyGraphInput = bodyGraphInput.map((subArray) => [
          String(subArray[0]),
          subArray[1],
        ]);
      }
    });
    console.log(bodyGraphInput);
    if (bodyGraphInput.length === 0) {
      setBodyWeightData(null);
    } else {
      bodyGraphInput.unshift(["Day", "Body Weight (Ibs)"]);
      setBodyWeightData(bodyGraphInput);
    }
  };

  const tileClassName = ({
    date,
  }: {
    date: Date;
    view: string;
  }): string | null => {
    const currentYear = new Date().getFullYear();
    const tileYear = date.getFullYear();

    if (tileYear === currentYear) {
      return "custom-tile-highlight";
    }
    return null;
  };
  return (
    <div>
      <TitleHeader title="📈My Progress"></TitleHeader>
      <div className="d-flex justify-content-center">
        <Calendar
          maxDetail="year"
          onChange={onChange}
          maxDate={new Date()}
          tileClassName={tileClassName}
        />
      </div>
      <h4 className="text-center mt-4">Your progress in {selectedDate}</h4>
      {bodyWeightData != null ? (
        <Chart
          chartType="LineChart"
          width="100%"
          height="400px"
          loader={<div>Loading Chart</div>}
          data={bodyWeightData}
          options={bodyWeightOptions}
        />
      ) : (
        <h5 className="mt-3 text-center">No Body Weight Recorded</h5>
      )}
    </div>
  );
};
export default ProgressPage;
