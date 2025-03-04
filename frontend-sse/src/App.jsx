import { useState } from "react";
import Login from "./Components/Login";
import Weather from "./Components/Weather";

function App() {
  const [loggedIn, setIsLoggedIn] = useState(false);
  const [profileUser, setProfileUser] = useState("");

  return (
    <>
      {!loggedIn ? (
        <Login setIsLoggedIn={setIsLoggedIn} setMainProfile={setProfileUser} />
      ) : (
        <Weather profileUser={profileUser} />
      )}
    </>
  );
}

export default App;
