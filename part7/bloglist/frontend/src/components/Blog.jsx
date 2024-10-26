import Togglable from "./Togglable.jsx";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import blogService from "../services/blogs";
import { useNotificationDispatch } from "../NotificationContext";
import { useUserValue } from "../UserContext";

const Blog = ({ blog, updateBlog, user, deleteBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const like = () => {
    const newBlog = {
      id: blog.id,
      user: blog.user,
      author: blog.author,
      title: blog.title,
      url: blog.url,
      likes: blog.likes + 1,
    };
    updateBlog(newBlog);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deleteBlog(blog);
    }
  };

  return (
    <div className="blog" style={blogStyle}>
      <div>
        {blog.title}
        <Togglable buttonLabel="view">
          <p>{blog.url}</p>
          <p>
            {"likes " + blog.likes}
            <button onClick={like}>like</button>
          </p>
          <p>{blog.author}</p>
          {user === blog.user.username ? (
            <button onClick={handleDelete}>remove</button>
          ) : null}
        </Togglable>
      </div>
    </div>
  );
};

const Blogs = () => {
  const queryClient = useQueryClient();
  const dispatch = useNotificationDispatch();
  const user = useUserValue();

  const result = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
  });
  const blogs = result.data;

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

  if (!blogs) return null;

  return (
    <>
      {blogs
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
    </>
  );
};

export default Blogs;
