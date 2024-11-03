import TitleHeader from "../Shared/titleHeader/titleHeader";
import { useState, useEffect } from "react";
import UserInformation from "../authenticatePage/userInformation";
import { useUser } from "../SesssionManager/session";
import { LocalUserData } from "../authenticatePage/userInformation";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
const ProfilePage = () => {
  const navigate = useNavigate();
  const base_url = import.meta.env.VITE_BASE_URL;
  const { user, logout } = useUser();
  const [localUser, setLocalUser] = useState<LocalUserData | null>(null);
  const [temporaryChanges, setTemporaryChanges] =
    useState<LocalUserData | null>(null);
  const [mode, setMode] = useState("view");
  //Load information from database on refresh
  useEffect(() => {
    const fetchData = () => {
      const storedUser = localStorage.getItem("user");
      const currentUser = user || (storedUser ? JSON.parse(storedUser) : null);
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
          setLocalUser(data.data);
          setTemporaryChanges(data.data);
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
  }, []);

  //Update/Delete handling
  const saveHandler = (): void => {
    if (mode === "view") {
      setMode("edit");
    } else {
      const query = `${base_url}/user/data/${user?.id}`;
      console.log(query);
      fetch(query, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(temporaryChanges),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((error) => {
              throw error.error;
            });
          }
          return response.json();
        })
        .then(() => {
          window.location.reload();
        })
        .catch((error) => {
          Swal.fire(
            error || "Something went wrong",
            "Please try again at a later time.",
            "error"
          );
        });
    }
  };
  const deleteHandler = (): void => {
    Swal.fire({
      title: "Are you sure you want to delete your account?",
      text: "This action is irreversible",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        const query = `${base_url}/user/data/${user?.id}`;
        fetch(query, {
          method: "DELETE",
        })
          .then((response) => {
            if (!response.ok) {
              return response.json().then((error) => {
                throw error.error;
              });
            }
            return response.json();
          })
          .then(() => {
            Swal.fire({
              title: "Sorry to see you go!",
              text: "This account has been permanently deleted",
              icon: "info",
            });
            logout();
            navigate("/");
          })
          .catch((error) => {
            Swal.fire(
              error || "Something went wrong",
              "Please try again at a later time.",
              "error"
            );
          });
      }
    });
  };
  const discardHandler = (): void => {
    window.location.reload();
  };

  //Util
  function getAge(): number {
    if (localUser == null) {
      return 0; // Return 0 if localUser is null
    }
    const today: Date = new Date();
    const birthDate: Date = new Date(localUser.birthday);
    let age: number = today.getFullYear() - birthDate.getFullYear();
    const monthDiff: number = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }
  const getMostRecentWeight = (): number | null => {
    if (
      localUser &&
      localUser.bodyWeightHistory &&
      localUser.bodyWeightHistory.length > 0
    ) {
      const sortedWeights = localUser.bodyWeightHistory.sort(
        (a: any, b: any) =>
          new Date(b.recordedOn).getTime() - new Date(a.recordedOn).getTime()
      );
      return sortedWeights[0].weight;
    }
    return null;
  };

  return (
    <div className="row">
      <TitleHeader title="🌟My Profile"></TitleHeader>
      {mode === "view" ? (
        <div className="col-12 text-center">
          <h2>
            {localUser?.firstName} {localUser?.lastName}
            {getAge() != 0 && (
              <span className="fs-5 text-secondary"> {getAge()}</span>
            )}
          </h2>
          <h5>✉️ Email : {localUser?.emailAddress}</h5>
          <h5>☎️ Phone : {localUser?.phoneNumber}</h5>
          {localUser?.bodyWeightHistory &&
            localUser?.bodyWeightHistory.length > 0 && (
              <h5>🏃‍♂️ Most Recent Bodyweight : {getMostRecentWeight()} kgs</h5>
            )}
        </div>
      ) : (
        <div className="row">
          <div className="col-12 d-flex justify-content-center">
            <form
              className="col-12 col-md-6"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <UserInformation
                header="Update your information!"
                data={temporaryChanges}
                dataChange={setTemporaryChanges}
              />
            </form>
          </div>
        </div>
      )}

      <div className="col-12 mt-4 d-flex justify-content-center profile-button-group">
        {mode === "edit" && (
          <button
            className="mb-4 btn btn-secondary"
            onClick={() => discardHandler()}
          >
            Discard
          </button>
        )}

        <button className="mb-4 btn btn-primary" onClick={() => saveHandler()}>
          {mode === "view" ? "Edit Profile" : "Save"}
        </button>
        <button
          className=" mb-4 btn btn-danger"
          onClick={() => deleteHandler()}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};
export default ProfilePage;
