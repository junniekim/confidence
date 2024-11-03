import "./sharedAuthenticate.css";

export interface LocalUserData {
  firstName: string;
  lastName: string;
  birthday: Date;
  emailAddress: string;
  phoneNumber: string;
  password: string;
  bodyWeightHistory: BodyWeightEntry[];
}

export interface BodyWeightEntry {
  recordedOn: Date; // or string if you prefer
  weight: number;
}

const formatPhoneNumber = (value: string) => {
  const cleaned = ("" + value).replace(/\D/g, "");
  let formattedValue = "";
  if (cleaned.length <= 3) {
    formattedValue = cleaned;
  } else if (cleaned.length <= 6) {
    formattedValue = `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  } else {
    formattedValue = `${cleaned.slice(0, 3)}-${cleaned.slice(
      3,
      6
    )}-${cleaned.slice(6, 10)}`;
  }

  return formattedValue;
};

const UserInformation = ({
  header,
  data,
  dataChange,
}: {
  header?: string;
  data?: LocalUserData | null;
  dataChange?: (data: any) => void;
}) => {
  return (
    <>
      <h5 className="text-center grey mb-4">{header}</h5>
      <div className="form-group mb-2">
        <label>
          <div className="input-header">
            First Name <span className="red-star">*</span>
          </div>
        </label>
        <input
          type="text"
          className="form-control"
          id="firstName"
          value={data?.firstName || ""}
          required
          onChange={(e) =>
            dataChange &&
            dataChange((prevState: any) => ({
              ...prevState,
              firstName: e.target.value,
            }))
          }
        />
      </div>
      <div className="form-group mb-2">
        <label>
          <div className="input-header">
            Last Name <span className="red-star">*</span>
          </div>
        </label>
        <input
          type="text"
          className="form-control"
          required
          id="lastName"
          value={data?.lastName || ""}
          onChange={(e) =>
            dataChange &&
            dataChange((prevState: any) => ({
              ...prevState,
              lastName: e.target.value,
            }))
          }
        />
      </div>
      <div className="form-group mb-2">
        <label>
          <div className="input-header">
            Birthday <span className="red-star">*</span>
          </div>
        </label>
        <input
          type="date"
          className="form-control"
          id="birthday"
          required
          value={data?.birthday?.toString().substring(0, 10) || ""}
          onChange={(e) =>
            dataChange &&
            dataChange((prevState: any) => ({
              ...prevState,
              birthday: e.target.value,
            }))
          }
        />
      </div>
      <div className="form-group mb-2">
        <label>
          <div className="input-header">
            Email Address <span className="red-star">*</span>
          </div>
        </label>
        <input
          type="email"
          required
          className="form-control"
          id="email"
          value={data?.emailAddress || ""}
          onChange={(e) =>
            dataChange &&
            dataChange((prevState: any) => ({
              ...prevState,
              emailAddress: e.target.value,
            }))
          }
        />
      </div>
      <div className="form-group mb-2">
        <div className="input-header">Phone Number</div>
        <input
          type="tel"
          required
          className="form-control"
          id="phone"
          value={data?.phoneNumber || ""}
          placeholder="XXX-XXX-XXXX"
          maxLength={12}
          minLength={12}
          onChange={(e: any) => {
            const inputNumber = e.target.value;
            const formattedNumber = formatPhoneNumber(inputNumber);
            // Update the state with the formatted phone number
            dataChange &&
              dataChange((prevState: any) => ({
                ...prevState,
                phoneNumber: formattedNumber,
              }));
          }}
        />
      </div>
      <div className="form-group mb-2">
        <label>
          <div className="input-header">
            <span>{header && header.startsWith("Update") && "New "}</span>
            Password <span className="red-star">*</span>
          </div>
        </label>
        <input
          type="password"
          className="form-control"
          id="password"
          onChange={(e) =>
            dataChange &&
            dataChange((prevState: any) => ({
              ...prevState,
              password: e.target.value,
            }))
          }
        />
      </div>
    </>
  );
};

export default UserInformation;
