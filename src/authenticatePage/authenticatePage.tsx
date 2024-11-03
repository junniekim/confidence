import { useState } from "react";
import SignIn from "./signin";
import SignUp from "./signup";

const AuthenticatePage = () => {
  const [hasAccount, setHasAccount] = useState(true);
  const handleSignInToggle = () => {
    setHasAccount(!hasAccount);
  };
  return (
    <div>
      {hasAccount ? (
        <SignIn onToggle={handleSignInToggle} />
      ) : (
        <SignUp onToggle={handleSignInToggle} />
      )}
    </div>
  );
};
export default AuthenticatePage;
