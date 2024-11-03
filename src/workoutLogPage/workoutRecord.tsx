import { useState, useEffect } from "react";
import Swal from "sweetalert2";

interface WorkoutRecordProps {
  workout: string;
  rep?: string;
  weight?: string;
  minute?: number;
  editing: boolean;
  set: number;
  index: number;
  dataChange?: (data: any) => void;
}

const WorkoutRecord: React.FC<WorkoutRecordProps> = ({
  workout,
  rep,
  weight,
  minute,
  editing,
  index,
  set,
  dataChange,
}) => {
  const base_url = import.meta.env.VITE_BASE_URL;
  const [givenWorkout, setGivenWorkout] = useState<any>(null);

  let [totalWorkoutList, setTotalWorkoutList] = useState<any[]>([]);
  let totalWorkoutListArr: any = [];
  useEffect(() => {
    const fetchData = () => {
      const query = `${base_url}/workout/data/${workout}`;
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
          setGivenWorkout({
            id: data.data[0]._id,
            cardio: data.data[0].cardio,
            name: data.data[0].name,
          });
        })
        .catch((error) => {
          Swal.fire(
            error || "Something went wrong",
            "Please try again at a later time.",
            "error"
          );
        });
    };
    if (workout) {
      fetchData();
    }

    totalWorkoutListArr = [];
    const query = `${base_url}/workout/data`;
    if (totalWorkoutList.length === 0) {
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
          totalWorkoutListArr = data.data.map((workout: any) => ({
            name: workout.name,
            id: workout._id,
          }));
          setTotalWorkoutList(totalWorkoutListArr);
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

  const deleteWorkout = () => {
    dataChange &&
      dataChange((prevState: any) => {
        return [...prevState].filter((_, i: number) => i !== index);
      });
  };

  return (
    <>
      {editing ? (
        <tr>
          <td>
            <select
              name="workouts"
              id="workouts"
              className="form-control"
              value={givenWorkout?.id || ""}
              onChange={(e) =>
                dataChange &&
                dataChange((prevState: any) => {
                  const updatedArray = [...prevState];
                  updatedArray[index] = {
                    ...updatedArray[index],
                    workout: e.target.value,
                  };
                  return updatedArray;
                })
              }
            >
              <option value="">Select a workout</option>
              {totalWorkoutList.map((workout: any) => (
                <option key={Math.random().toFixed(8)} value={workout.id}>
                  {workout.name}
                </option>
              ))}
            </select>
          </td>
          {givenWorkout?.cardio ? (
            <td colSpan={3}>
              <input
                type="number"
                placeholder="In Minute..."
                className="form-control"
                defaultValue={minute || ""}
                id="editMinute"
                onBlur={(e) =>
                  dataChange &&
                  dataChange((prevState: any) => {
                    const updatedArray = [...prevState];

                    updatedArray[index] = {
                      ...updatedArray[index],
                      minute: Number(e.target.value),
                    };

                    return updatedArray;
                  })
                }
              />
            </td>
          ) : (
            <>
              <td>
                <input
                  type="number"
                  className="form-control"
                  defaultValue={rep || ""}
                  id="editRep"
                  onBlur={(e) =>
                    dataChange &&
                    dataChange((prevState: any) => {
                      const updatedArray = [...prevState];

                      updatedArray[index] = {
                        ...updatedArray[index],
                        rep: Number(e.target.value),
                      };

                      return updatedArray;
                    })
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  className="form-control"
                  defaultValue={set || ""}
                  id="editSet"
                  onBlur={(e) =>
                    dataChange &&
                    dataChange((prevState: any) => {
                      const updatedArray = [...prevState];

                      updatedArray[index] = {
                        ...updatedArray[index],
                        set: Number(e.target.value),
                      };

                      return updatedArray;
                    })
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  className="form-control"
                  defaultValue={weight || ""}
                  id="editWeight"
                  onBlur={(e) =>
                    dataChange &&
                    dataChange((prevState: any) => {
                      const updatedArray = [...prevState];

                      updatedArray[index] = {
                        ...updatedArray[index],
                        weight: Number(e.target.value),
                      };

                      return updatedArray;
                    })
                  }
                />
              </td>
            </>
          )}

          <td>
            <button
              className="text-button-delete"
              onClick={() => deleteWorkout()}
            >
              X
            </button>
          </td>
        </tr>
      ) : (
        <tr>
          <td className="th-tr">{givenWorkout?.name}</td>
          {givenWorkout?.cardio ? (
            <>
              <td className="th-tr" colSpan={3}>
                {minute} {minute && "Minutes"}
              </td>
            </>
          ) : (
            <>
              <td className="th-tr">{rep}</td>
              <td className="th-tr">{set}</td>
              <td className="th-tr">{weight}</td>
            </>
          )}
        </tr>
      )}
    </>
  );
};

export default WorkoutRecord;
