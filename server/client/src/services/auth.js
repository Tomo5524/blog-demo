const API_URL = "http://localhost:5000/api";

// async function logIn(username, password) {
//   const request = await fetch(`${API_URL}/login`, {
//     method: "post",
//     headers: { "Content-Type": "application/json" },
//     mode: "cors",
//     body: JSON.stringify({ username, password }),
//   });
//   const user = await request.json();
//   if (user.token) {
//     localStorage.setItem("currentUser", JSON.stringify(user));
//   }
//   return user;
// }

function authHeader() {
  const user = getUser();
  if (user && user.token) {
    return `Bearer ${user.token}`;
  } else {
    return {};
  }
}

function logOut() {
  localStorage.removeItem("currentUser");
  window.location.reload();
}

function getUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

export default { authHeader, logOut, getUser };
