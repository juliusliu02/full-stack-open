import Notification from "./Notification";
import { useState } from "react";
import loginService from "../services/login";
import blogService from "../services/blogs";
import { useUserDispatch } from "../UserContext";
import { useNotificationDispatch } from "../NotificationContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const userDispatch = useUserDispatch();
  const dispatch = useNotificationDispatch();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      userDispatch({ type: "SET_USER", payload: user });
      setUsername("");
      setPassword("");
      blogService.setToken(user.token);
      window.localStorage.setItem("currentUser", JSON.stringify(user));
    } catch (exception) {
      dispatch({ type: "ERROR", payload: "Wrong credentials" });
    }
  };

  return (
    <>
      <h1>log in to application</h1>
      <form data-testid="login-form" onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            data-testid="username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            data-testid="password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
      <Notification />
    </>
  );
};

export default Login;
