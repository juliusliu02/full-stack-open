import { useEffect, useRef, useContext } from "react";
import Blogs from "./components/Blog";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import Notification from "./components/Notification";
import Login from "./components/Login";
import { useQuery } from "@tanstack/react-query";
import userContext from "./UserContext";

const App = () => {
  const [user, userDispatch] = useContext(userContext);

  const blogFormRef = useRef();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("currentUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      userDispatch({ type: "SET_USER", payload: user });
      blogService.setToken(user.token);
    }
  }, []);

  const logOut = () => {
    window.localStorage.clear();
    userDispatch({ type: "CLEAR_USER" });
  };

  if (!user) {
    return <Login />;
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <p>{(user.name || user.username) + " logged in"}</p>
      <button onClick={logOut}>log out</button>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm blogFormRef={blogFormRef} />
      </Togglable>
      <Blogs />
    </div>
  );
};

export default App;
