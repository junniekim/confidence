import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./sharedAuthenticate.css";
import TitleHeader from "../Shared/titleHeader/titleHeader";
import UserInformation from "./userInformation";
import Swal from "sweetalert2";
import { useUser } from "../SesssionManager/session";
const base_url = import.meta.env.BASE_URL;
const SignUp = (props: any) => {
  const { login } = useUser();
  const navigate = useNavigate();

  const [newUserData, setNewUserData] = useState(null);

  const signUpHandler = () => {
    const query = `${base_url}/newAccount`;
    fetch(query, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUserData),
    })
      .then((response) => response.json())
      .then((data) => {
        Swal.fire(data).then(() => {
          login(data);
          navigate("/");
        });
      })
      .catch((error) => {
        Swal.fire(
          `Something went wrong: ${error}`,
          "Please try again at a later time.",
          "error"
        );
      });
  };

  return (
    <div className="row">
      <TitleHeader title="Sign Up"></TitleHeader>
      <div className="col-12 d-flex justify-content-center">
        <form
          className="col-12 col-md-6"
          onSubmit={(e) => {
            e.preventDefault();
            signUpHandler();
          }}
        >
          <UserInformation
            data={newUserData}
            dataChange={setNewUserData}
            header="Create Confidence account today and enjoy all services we offer!"
          />
          <div className="mt-3  d-flex flex-column text-center justify-content-center">
            <button type="submit" className="mb-2 btn btn-primary">
              Sign Up
            </button>
            <div>
              <small>
                <button className="text-button" onClick={props.onToggle}>
                  Already have an account?
                </button>
              </small>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default SignUp;
