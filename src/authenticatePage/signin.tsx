import "./sharedAuthenticate.css";
import { useNavigate } from "react-router-dom";
import TitleHeader from "../Shared/titleHeader/titleHeader";
import Swal from "sweetalert2";
import { useUser } from "../SesssionManager/session";
const SignIn = (props: any) => {
  const base_url = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const { login } = useUser();
  const forgotPasswordHandler = () => {
    Swal.fire({
      title: "Forgot Password",
      text: "Please enter your email address",
      input: "email",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Submit",
      showLoaderOnConfirm: true,
      preConfirm: (email) => {
        const query = `http://localhost:3000/user/reset`;
        fetch(query, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            emailAddress: email,
          }),
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
            Swal.fire({
              title: "Email sent",
              text: "Please check your email.",
            });
          })
          .catch((error) => {
            Swal.fire(error || "Something went wrong", "", "error");
          });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  };

  const signInHandler = () => {
    const emailAddress = (document.getElementById("email") as HTMLInputElement)
      ?.value;
    const password = (document.getElementById("password") as HTMLInputElement)
      ?.value;
    (document.getElementById("email") as HTMLInputElement).value = "";
    (document.getElementById("password") as HTMLInputElement).value = "";
    const query = `${base_url}/user/signin`;
    fetch(query, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ emailAddress: emailAddress, password: password }),
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
        login(data.data);
        Swal.fire("Success", "You have successfully signed in", "success").then(
          () => {
            navigate("/");
          }
        );
      })
      .catch((error) => {
        Swal.fire(
          error || "Something went wrong",
          "Please try again at a later time.",
          "error"
        );
      });
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
