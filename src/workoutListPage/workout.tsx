import React from "react";
import "./workout.css";
type WorkoutProps = {
  name: string;
  cardio?: boolean;
  target?: any[];
  picture?: string;
};

const Workout: React.FC<WorkoutProps> = ({ name, picture }) => {
  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3">
      <div className="mb-4 pt-2 text-center workout-box">
        <h3 className="mt-2">{name}</h3>
        <div className="image-box">
          <img src={picture} className="img-fluid each-image" alt={name} />
        </div>
      </div>
    </div>
  );
};

export default Workout;
