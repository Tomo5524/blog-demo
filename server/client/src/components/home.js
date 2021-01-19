import React, { useState, useEffect } from "react";
import auth from "../services/auth";
function Home() {
  const [currentUser, setCurrentUser] = useState(auth.getUser());
  if (currentUser) {
    console.log(currentUser, "currentUser");
    console.log(currentUser.user.username, "currentUser");
  }
  const handleLogOut = () => {
    setCurrentUser("");
    auth.logOut();
  };

  return (
    <div>
      <h2>Welcome to SRST Fitness</h2>
      <h4>Introduce your self</h4>
      {currentUser ? <h4>Welcomeback {currentUser.user.username}!</h4> : ""}!
      <button className="btn btn-primary" onClick={handleLogOut}>
        Log out
      </button>
    </div>
  );
}

export default Home;
