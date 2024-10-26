import { useState, useEffect, useRef, useContext } from "react";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import { useNotificationDispatch } from "./NotificationContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import userContext from "./UserContext";

const Login = ({
  handleLogin,
  username,
  setUsername,
  password,
  setPassword,
}) => {
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

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, userDispatch] = useContext(userContext);
  const dispatch = useNotificationDispatch();

  const blogFormRef = useRef();

  const result = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
  });
  const blogs = result.data;

  const queryClient = useQueryClient();
  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(["blogs"], blogs.concat(newBlog));
    },
  });

  const updateBlogMutation = useMutation({
    mutationFn: blogService.update,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(
        ["blogs"],
        blogs.map((blog) => (blog.id === newBlog.id ? newBlog : blog)),
      );
    },
  });
  const deleteBlogMutation = useMutation({
    mutationFn: (blogToDelete) => {
      blogService.deleteBlog(blogToDelete);
      return blogToDelete;
    },
    onSuccess: (blogToDelete) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(
        ["blogs"],
        blogs.filter((blog) => blog.id !== blogToDelete.id),
      );
    },
  });

  const showErrorMessage = (message) => {
    dispatch({
      type: "SET_NOTIFICATION",
      payload: { type: "error", body: message },
    });
    setTimeout(() => {
      dispatch({ type: "CLEAR_NOTIFICATION" });
    }, 5000);
  };

  const showSuccessMessage = (message) => {
    dispatch({
      type: "SET_NOTIFICATION",
      payload: { type: "success", body: message },
    });
    setTimeout(() => {
      dispatch({ type: "CLEAR_NOTIFICATION" });
    }, 5000);
  };

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
      showErrorMessage("Wrong credentials");
    }
  };

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("currentUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      userDispatch({ type: "SET_USER", payload: user });
      blogService.setToken(user.token);
    }
  }, []);

  if (user === null) {
    return (
      <Login
        handleLogin={handleLogin}
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
      />
    );
  }

  const logOut = () => {
    window.localStorage.clear();
    userDispatch({ type: "CLEAR_USER" });
  };

  const createBlog = async (blog) => {
    try {
      newBlogMutation.mutate(blog);
      showSuccessMessage(`A new blog ${blog.title} by ${blog.author} added.`);
      blogFormRef.current.toggleVisibility();
    } catch (exception) {
      showErrorMessage("Creation failed: " + exception.message);
    }
  };

  const updateBlog = async (blog) => {
    updateBlogMutation.mutate(blog);
  };

  const deleteBlog = async (blogToDelete) => {
    try {
      deleteBlogMutation.mutate(blogToDelete);
      showSuccessMessage("Blog is successfully deleted.");
    } catch (exception) {
      showErrorMessage("Error: " + exception.message);
    }
  };

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <p>{(user.name || user.username) + " logged in"}</p>
      <button onClick={logOut}>log out</button>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>
      {blogs &&
        blogs
          .sort((a, b) => a.likes - b.likes)
          .reverse()
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              updateBlog={updateBlog}
              user={user.username}
              deleteBlog={deleteBlog}
            />
          ))}
    </div>
  );
};

export default App;
