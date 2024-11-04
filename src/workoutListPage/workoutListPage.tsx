import TitleHeader from "../Shared/titleHeader/titleHeader";
import "react-dropdown/style.css";
import Workout from "./workout";
import "./workoutListPage.css";
import { useEffect, useState } from "react";
import Select from "react-select";
import Swal from "sweetalert2";
interface WorkoutInterface {
  name: string;
  cardio: boolean;
  picture: string;
  target: string[];
}
const WorkoutListPage = () => {
  const base_url = import.meta.env.VITE_BASE_URL;

  //valid set of paths for each target
  const [validTargetPath, setValidTargetPath] = useState<any>([]);
  //workout List available
  const [workoutList, setWorkoutList] = useState<Array<WorkoutInterface>>([]);

  // 4 states for path selection
  const [path1, setPath1] = useState<any>("");
  const [path2, setPath2] = useState<any>("");
  const [path3, setPath3] = useState<any>("");
  const [path4, setPath4] = useState<any>("");

  //fetch all workout data
  useEffect(() => {
    const query = `${base_url}/workout/data`;
    if (workoutList.length === 0) {
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
          const workoutList = data.data;
          //get workouts with unique path
          let distinctWorkouts = workoutList.filter(
            (workout: any, index: number, array: any[]) => {
              return !array
                .slice(0, index)
                .some(
                  (prevWorkout: any) =>
                    prevWorkout.target.join() === workout.target.join()
                );
            }
          );
          //Extract path
          let distinctWorkoutPath = distinctWorkouts.map((workout: any) => {
            return workout.target;
          });
          setValidTargetPath(distinctWorkoutPath);
          setWorkoutList(workoutList);
        })
        .catch((error) => {
          Swal.fire(
            error || "Something went wrong",
            "Please try again at a later time.",
            "error"
          );
        });
    }
  }, []);

  //Set valid options that generates valid paths
  let option1: any[] = [];
  let option2: any[] = [];
  let option3: any[] = [];
  let option4: any[] = [];
  validTargetPath.forEach((path: any) => {
    if (path[0] && !option1.some((option: any) => option.value === path[0])) {
      option1.push({ value: path[0], label: path[0] });
    }
    if (path[1] && !option2.some((option: any) => option.value === path[1])) {
      option2.push({ value: path[1], label: path[1], previous: path[0] });
    }
    if (path[2] && !option3.some((option: any) => option.value === path[2])) {
      option3.push({ value: path[2], label: path[2], previous: path[1] });
    }
    if (path[3] && !option4.some((option: any) => option.value === path[3])) {
      option4.push({ value: path[3], label: path[3], previous: path[2] });
    }
  });

  //Handle drop down change
  useEffect(() => {
    setPath2("");
    setPath3("");
    setPath4("");
  }, [path1]);
  useEffect(() => {
    setPath3("");
    setPath4("");
  }, [path2]);
  useEffect(() => {
    setPath4("");
  }, [path3]);
  const clearPath = () => {
    setPath1("");
    setPath2("");
    setPath3("");
    setPath4("");
  };

  return (
    <div>
      <TitleHeader title="✏️Workouts"></TitleHeader>
      <div className="row d-flex flex-row workout-navigator">
        <Select
          className="mt-2 mb-2  col-12 col-md-3 col-lg-2"
          options={option1}
          placeholder="Select an option"
          value={path1}
          onChange={(selectedOption) => setPath1(selectedOption)}
        ></Select>

        {path1 &&
          option2.filter((option) => option.previous === path1?.value).length >
            0 && (
            <>
              <h2 className="mt-2 mb-2 col-auto">»</h2>
              <Select
                className=" mt-2 mb-2 col-12 col-md-3 col-lg-2"
                options={option2.filter(
                  (option) => option.previous === path1?.value
                )}
                placeholder="Select an option"
                value={path2}
                onChange={(selectedOption) => setPath2(selectedOption)}
              ></Select>
            </>
          )}

        {path2 &&
          option3.filter((option) => option.previous === path2?.value).length >
            0 && (
            <>
              <h2 className="mt-2 mb-2 col-auto">»</h2>
              <Select
                className=" mt-2 mb-2 col-12 col-md-3 col-lg-2"
                options={option3.filter(
                  (option) => option.previous === path2?.value
                )}
                placeholder="Select an option"
                value={path3}
                onChange={(selectedOption) => setPath3(selectedOption)}
              ></Select>
            </>
          )}

        {path3 &&
          option4.filter((option) => option.previous === path3?.value).length >
            0 && (
            <>
              <h2 className="mt-2 mb-2 col-auto">»</h2>
              <Select
                className=" mt-2 mb-2 col-12 col-md-3 col-lg-2"
                options={option4.filter(
                  (option) => option.previous === path3?.value
                )}
                placeholder="Select an option"
                value={path4}
                onChange={(selectedOption) => setPath4(selectedOption)}
              ></Select>
            </>
          )}

        <button
          className=" mt-2 mb-2 col-12 col-md-3 col-lg-2 ms-auto btn btn-danger"
          disabled={path1 === ""}
          onClick={() => clearPath()}
        >
          Clear
        </button>
      </div>

      <div className="mt-4 row d-flex flex-row">
        {workoutList
          .filter((workout: any) => {
            if (path4) return workout.target.includes(path4.value);
            if (path3) return workout.target.includes(path3.value);
            if (path2) return workout.target.includes(path2.value);
            if (path1) return workout.target.includes(path1.value);
            return true;
          })
          .map((workout: any, index: number) => (
            <Workout
              key={index}
              target={workout.target}
              picture={workout.picture}
              cardio={workout.cardio}
              name={workout.name}
            ></Workout>
          ))}
      </div>
    </div>
  );
};
export default WorkoutListPage;
