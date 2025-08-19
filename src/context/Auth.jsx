export const Auth = () => {
    const baseURL = import.meta.env.VITE_BASE_URL;
    console.log("Ayotide")
  //sign in to google start
  const handleSignIn = () => {
    // e.preventDefault();
    console.log("Redirecting to google sign in");
    window.location.href = `${baseURL}/auth/google`;
  };

  //sign in to google end

  return {
    handleSignIn,
  };
};
