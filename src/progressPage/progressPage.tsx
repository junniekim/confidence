import TitleHeader from "../Shared/titleHeader/titleHeader";
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Chart } from "react-google-charts";
import { useUser } from "../SesssionManager/session";
import "./progressPage.css";
import Swal from "sweetalert2";

export const bodyWeightOptions = {
  title: "Body Weight Graph",
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
export const weightLiftingOptions = {
  title: "Max Weight Graph",
  curveType: "function",
  legend: "none",
  vAxis: {
    title: "Weight (Ibs)",
  },
  titleTextStyle: {
    fontSize: 18,
  },
  hAxis: {
    title: "Day",
  },
  pointSize: 5,
};

//soon as page loads, I need a list of body weight with date and number
//Also need a list of workout, date, weight

const ProgressPage = () => {
  const [userProgress, setUserProgress] = useState<any>(null);
  const [chosenWorkout, setChosenWorkout] = useState("");
  const [bodyWeightData, setBodyWeightData] = useState<any>(null);
  const [weightLiftingProgress, setWeightLiftingProgress] = useState<any>(null);
  const [weightLiftingData, setWeightLiftingData] = useState<any>(null);
  const [dropdownOptions, setDropdownOptions] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<String>(
    new Date().toLocaleString("en-US", { month: "long", year: "numeric" })
  );
  const base_url = import.meta.env.VITE_BASE_URL;
  const { user } = useUser();
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const currentUser = user || (storedUser ? JSON.parse(storedUser) : null);

    //Query to get user's body weight history
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

    // Query to get users entire workout history
    const query2 = `${base_url}/log/data/joined/${currentUser.id}`;
    fetch(query2)
      .then((response) => {
        if (!response.ok) {
          return response.json().then((error) => {
            throw error.error;
          });
        }
        return response.json();
      })
      .then((data) => {
        setWeightLiftingProgress(data.data);
        setDropdownOptions(
          data.data.filter(
            (workout: any, index: any, self: any) =>
              index ===
              self.findIndex((w: any) => w.workout._id === workout.workout._id)
          )
        );
      });
  }, []);

  useEffect(() => {
    let bodyGraphInput: any[] = [];

    userProgress?.filter((element: any) => {
      if (
        new Date(element.recordedOn)
          .toLocaleString("en-US", { month: "long", year: "numeric" })
          .replace(/\//g, "-") === selectedDate
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
    if (bodyGraphInput.length === 0) {
      setBodyWeightData(null);
    } else {
      bodyGraphInput.unshift(["Day", "Body Weight (Ibs)"]);
      setBodyWeightData(bodyGraphInput);
    }
    let weightLiftingGraphInput: any[] = [];
    weightLiftingProgress?.filter((element: any) => {
      if (
        element.workout._id == chosenWorkout &&
        new Date(element.recordedOn)
          .toLocaleString("en-US", { month: "long", year: "numeric" })
          .replace(/\//g, "-") === selectedDate
      ) {
        weightLiftingGraphInput.push([
          Number(
            new Date(element.recordedOn).toLocaleString("en-US", {
              day: "numeric",
            })
          ) + 1,
          element.weight,
        ]);
        weightLiftingGraphInput.sort((a, b) => a[0] - b[0]);
        weightLiftingGraphInput = weightLiftingGraphInput.map((subArray) => [
          String(subArray[0]),
          subArray[1],
        ]);
      }
    });
    console.log("Graph input", weightLiftingGraphInput);
    if (weightLiftingGraphInput.length === 0) {
      setWeightLiftingData(null);
    } else {
      weightLiftingGraphInput.unshift(["Day", "Body Weight (Ibs)"]);
      setWeightLiftingData(weightLiftingGraphInput);
    }
  }, [selectedDate, chosenWorkout, userProgress]);

  const onChange = (date: any) => {
    setSelectedDate(
      date.toLocaleString("en-US", { month: "long", year: "numeric" })
    );
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
      <TitleHeader title="📈Analysis"></TitleHeader>
      <div className="d-flex justify-content-center">
        <Calendar
          maxDetail="year"
          onChange={onChange}
          maxDate={new Date()}
          tileClassName={tileClassName}
        />
      </div>
      <h2 className="text-center mt-4">Body weight change in {selectedDate}</h2>
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
      <hr></hr>
      <h2 className="text-center mt-4">
        Max weight lifted change in {selectedDate}
      </h2>
      {chosenWorkout != null &&
        (weightLiftingData != null ? (
          <Chart
            chartType="LineChart"
            width="100%"
            height="400px"
            loader={<div>Loading Chart</div>}
            data={weightLiftingData}
            options={weightLiftingOptions}
          />
        ) : (
          <h5 className="mt-3 text-center">No Weight lifting Recorded</h5>
        ))}
      <div className="d-flex justify-content-center align-items-cente">
        <div className="mt-3 workout-selector w-25">
          <h5 className=" text-center">Please choose workout</h5>
          <div className="d-flex justify-content-center align-items-center">
            <select
              className="w-100 form-control text-center "
              name="workouts"
              id="workouts"
              value={chosenWorkout}
              onChange={(e) => {
                setChosenWorkout(e.target.value);
                onChange(selectedDate);
              }}
            >
              <option value="">Select a workout</option>
              {dropdownOptions?.map((workout: any) => (
                <option
                  key={Math.random().toFixed(8)}
                  value={workout.workout._id}
                >
                  {workout.workout.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProgressPage;
