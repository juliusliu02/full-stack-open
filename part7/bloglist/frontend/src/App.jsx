import { useEffect, useRef, useContext } from "react";
import { Blog, Blogs } from "./components/Blog";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import Notification from "./components/Notification";
import Login from "./components/Login";
import { User, Users } from "./components/Users";
import userContext from "./UserContext";

import { Routes, Route, Link, useMatch } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import UserService from "./services/users";
import { useNotificationDispatch } from "./NotificationContext";
import Navigation from "./components/Navigation";

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

  const userQuery = useQuery({
    queryKey: ["users"],
    queryFn: UserService.getAll,
  });

  const users = userQuery.data || [];

  const userMatch = useMatch("/users/:id");
  const matchedUser = userMatch
    ? users.find((user) => user.id === userMatch.params.id)
    : null;

  const queryClient = useQueryClient();
  const dispatch = useNotificationDispatch();

  const result = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
  });
  const blogs = result.data || [];

  const blogMatch = useMatch("/blogs/:id");
  const matchedBlog = blogMatch
    ? blogs.find((blog) => blog.id === blogMatch.params.id)
    : null;

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

  const updateBlog = async (blog) => {
    updateBlogMutation.mutate(blog);
  };

  const deleteBlog = async (blogToDelete) => {
    try {
      deleteBlogMutation.mutate(blogToDelete);
      dispatch({ type: "SUCCESS", payload: "Blog is successfully deleted." });
    } catch (exception) {
      dispatch({ type: "ERROR", payload: "Error: " + exception.message });
    }
  };

  if (!user) {
    return <Login />;
  }

  return (
    <div className="container mx-auto px-4 py-3">
      <Navigation />

      <Notification />

      <div className="container px-4 py-3">
        <p className="dark:text-white py-1">
          {(user.name || user.username) + " logged in "}
          <button
            onClick={logOut}
            type="button"
            className="py-1 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
          >
            log out
          </button>
        </p>
      </div>

      <div className="container px-4 py-1">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Togglable buttonLabel="new blog" ref={blogFormRef}>
                  <BlogForm blogFormRef={blogFormRef} />
                </Togglable>
                <Blogs blogs={blogs} />
              </>
            }
          />
          <Route
            path="/blogs/:id"
            element={
              <Blog
                blog={matchedBlog}
                user={user}
                updateBlog={updateBlog}
                deleteBlog={deleteBlog}
              />
            }
          />
          <Route path="/users" element={<Users users={users} />} />
          <Route path="/users/:id" element={<User user={matchedUser} />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
