import "./sharedAuthenticate.css";
import { useNavigate } from "react-router-dom";
import TitleHeader from "../Shared/titleHeader/titleHeader";
import Swal from "sweetalert2";
import { useUser } from "../SesssionManager/session";

const SignIn = (props: any) => {
  const navigate = useNavigate();
  const { login } = useUser();
  const forgotPasswordHandler = () => {
    console.log("Forgot password clicked");
    navigate("/");
  };

  const signInHandler = () => {
    const email = (document.getElementById("email") as HTMLInputElement)?.value;
    const password = (document.getElementById("password") as HTMLInputElement)
      ?.value;
    (document.getElementById("email") as HTMLInputElement).value = "";
    (document.getElementById("password") as HTMLInputElement).value = "";
    const query = `http://localhost:3000/authenticate`;
    fetch(query, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        login(data);
        Swal.fire("Success", "You have successfully signed in", "success").then(
          () => {
            navigate("/");
          }
        );
      })
      .catch((error) => {
        Swal.fire(
          `Something went wrong: ${error}`,
          "Please try again at a later time.",
          "error"
        );
      });
    navigate("/");
  };

  return (
    <div className="row">
      <TitleHeader title="Sign In"></TitleHeader>
      <div className="col-12 d-flex justify-content-center">
        <form
          className="col-12 col-md-6"
          onSubmit={(e) => {
            e.preventDefault();
            signInHandler();
          }}
        >
          <div className="form-group mb-2">
            <input
              type="email"
              placeholder="Email"
              className="form-control"
              id="email"
              required
            />
          </div>
          <div className="form-group mb-2">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              id="password"
              required
            />
          </div>

          <div className="d-flex flex-column text-center justify-content-center">
            <button type="submit" className="btn btn-primary mb-2">
              Sign In
            </button>
            <div>
              <small>
                <button className="text-button" onClick={props.onToggle}>
                  New to Confidence?
                </button>
              </small>
              <span className="ml-2 mr-2">|</span>
              <small>
                <button
                  type="button"
                  className="text-button"
                  onClick={() => forgotPasswordHandler()}
                >
                  Forgot password?
                </button>
              </small>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default SignIn;
