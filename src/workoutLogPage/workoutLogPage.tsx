import TitleHeader from "../Shared/titleHeader/titleHeader";
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import Swal from "sweetalert2";
import WorkoutRecord from "./workoutRecord";
import WorkoutJournal from "./workoutJournal";
import { useUser } from "../SesssionManager/session";
import "react-calendar/dist/Calendar.css";
import "./workoutLogPage.css";
const WorkoutLogPage = () => {
  const base_url = import.meta.env.VITE_BASE_URL;
  const { user } = useUser();

  //workout at selected date.
  const [currentDayWorkout, setCurrentDayWorkout] = useState<any[]>([]);
  //Progress at a selected date
  const [currentDayProgress, setCurrentDayProgress] = useState<any>(null);
  //current mode
  const [editing, setEditing] = useState(false);

  const dataSetUp = (date: Date) => {
    const storedUser = localStorage.getItem("user");
    const currentUser = user || (storedUser ? JSON.parse(storedUser) : null);
    const fetchData = () => {
      const query = `${base_url}/user/data/${currentUser!.id}`;
      fetch(query, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((error) => {
              throw error.error;
            });
          }
          return response.json();
        })
        .then((data) => {
          const foundProgress = data.data?.progress.find((element: any) => {
            return element.recordedOn.substring(0, 10) === dateFormatter(date);
          });
          setCurrentDayProgress(foundProgress || null);
        })
        .catch((error) => {
          Swal.fire(
            error || "Something went wrong",
            "Please try again at a later time.",
            "error"
          );
        });
    };
    const fetchDataWorkout = () => {
      const query = `${base_url}/log/data/${currentUser!.id}`;
      fetch(query, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((error) => {
              throw error.error;
            });
          }
          return response.json();
        })
        .then((data) => {
          const foundWorkout = data.data?.filter((element: any) => {
            return element.recordedOn.substring(0, 10) === dateFormatter(date);
          });
          setCurrentDayWorkout(foundWorkout || null);
        })
        .catch((error) => {
          Swal.fire(
            error || "Something went wrong",
            "Please try again at a later time.",
            "error"
          );
        });
    };
    fetchData();
    fetchDataWorkout();
  };
  useEffect(() => {
    dataSetUp(new Date());
  }, []);

  //helper for Calendar
  //Styling
  const tileClassName = ({ date }: { date: Date }): string | null => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const tileYear = date.getFullYear();
    const tileMonth = date.getMonth();
    if (tileYear === currentYear && tileMonth === currentMonth) {
      return "custom-tile-highlight";
    }
    return null;
  };
  //Take date, spit out YYYY-MM-DD format
  const dateFormatter = (date: any) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  };
  //selected date
  const [selectedDate, setSelectedDate] = useState<String>(
    dateFormatter(new Date())
  );
  //when date changes
  const onChange = (date: any) => {
    setSelectedDate(dateFormatter(date));
    dataSetUp(date);
  };

  const addWorkoutHandler = () => {
    setCurrentDayWorkout((prevState: any) => [
      ...(prevState || []),
      { recordedOn: selectedDate },
    ]);
  };

  const saveHandler = (): void => {
    if (editing) {
      //input validation

      //check if all workout title is filled
      if (
        currentDayWorkout?.some(
          (workout: any) =>
            workout.workout === undefined || workout.workout === null
        )
      ) {
        Swal.fire({
          icon: "error",
          title: "Please fill in all workout title entries",
        });
        return;
      }
      if (currentDayWorkout && currentDayWorkout.length > 0) {
        //update log table
        const query = `http://localhost:3000/log/data/${user?.id}`;
        fetch(query, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currentDayWorkout),
        })
          .then((response) => {
            if (!response.ok) {
              return response.json().then((error) => {
                throw error.error;
              });
            }
            return response.json();
          })
          .then(() => {})
          .catch((error) => {
            Swal.fire(
              error || "Something went wrong",
              "Please try again at a later time.",
              "error"
            );
          });
      }
      console.log(currentDayProgress);

      if (currentDayProgress) {
        const query2 = `http://localhost:3000/user/data/journal/${user?.id}`;
        const copyToSend = currentDayProgress;
        copyToSend.recordedOn = selectedDate;
        fetch(query2, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(copyToSend),
        })
          .then((response) => {
            if (!response.ok) {
              return response.json().then((error) => {
                throw error.error;
              });
            }
            return response.json();
          })
          .then(() => {})
          .catch((error) => {
            Swal.fire(
              error || "Something went wrong",
              "Please try again at a later time.",
              "error"
            );
          });
      }
    }
    setEditing(!editing);
  };

  return (
    <div>
      <TitleHeader title="💪My Tracking"></TitleHeader>
      <div className="d-flex justify-content-center">
        {!editing && (
          <Calendar
            defaultValue={(() => {
              const date = new Date(selectedDate.toString());
              date.setDate(date.getDate() + 1);
              return date;
            })()}
            maxDetail="month"
            onChange={onChange}
            maxDate={new Date()}
            tileClassName={tileClassName}
          />
        )}
      </div>
      <div className="col-12 text-center mt-3">
        <button className="btn mb-3 btn-primary" onClick={() => saveHandler()}>
          {editing
            ? `Save Your Journey on ${selectedDate}`
            : `Mark Your Journey on ${selectedDate}`}
        </button>
      </div>
      <div className="row workout-tracker-box">
        <div className="col-12 col-lg-6 text-center">
          <h4>Workout Tracker</h4>

          {currentDayWorkout?.length > 0 ? (
            <table className="mb-3 w-100">
              <colgroup>
                <col className="w-40"></col>
                <col className="w-20"></col>
                <col className="w-20"></col>
                <col className="w-20"></col>
                {editing && <col className="w-5"></col>}
              </colgroup>
              <thead>
                <tr className="th-tr">
                  <th className="th-tr">Title</th>
                  <th className="th-tr">Rep</th>
                  <th className="th-tr">Set</th>
                  <th className="th-tr">Weight</th>
                  {editing && <th></th>}
                </tr>
              </thead>
              <tbody>
                {currentDayWorkout?.map((workout: any, index: number) => (
                  <WorkoutRecord
                    key={Math.random().toFixed(8)}
                    workout={workout.workout}
                    rep={workout.rep}
                    weight={workout.weight}
                    set={workout.set}
                    minute={workout.minute}
                    editing={editing}
                    index={index}
                    dataChange={setCurrentDayWorkout}
                  ></WorkoutRecord>
                ))}
              </tbody>
            </table>
          ) : (
            <div>No content</div>
          )}
          {editing ? (
            <div className="d-flex justify-content-center slight-gap">
              <button
                className="mt-2 btn btn-outline-primary"
                onClick={() => addWorkoutHandler()}
              >
                Add Workout
              </button>
            </div>
          ) : null}
        </div>
        <WorkoutJournal
          dataChange={setCurrentDayProgress}
          rate={currentDayProgress?.rate}
          weight={currentDayProgress?.weight}
          journal={currentDayProgress?.journal}
          editing={editing}
        ></WorkoutJournal>
      </div>
    </div>
  );
};
export default WorkoutLogPage;
