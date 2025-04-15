import { SupaPileAUTHContext } from "./SupaPileContext";
import { Auth } from "./Auth";

const AuthProvider = ({ children }) => {
  const { handleSignIn } = Auth();
  return (
    <SupaPileAUTHContext.Provider
      value={{
        handleSignIn,
      }}
    >
      {children}
    </SupaPileAUTHContext.Provider>
  );
};

export default AuthProvider;
