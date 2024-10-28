import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import blogService from "../services/blogs";
import { useNotificationDispatch } from "../NotificationContext";

const BlogForm = ({ blogFormRef }) => {
  const queryClient = useQueryClient();
  const dispatch = useNotificationDispatch();

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(["blogs"], blogs.concat(newBlog));
    },
  });

  const createBlog = async (blog) => {
    try {
      newBlogMutation.mutate(blog);
      dispatch({
        type: "SUCCESS",
        payload: `A new blog ${blog.title} by ${blog.author} added.`,
      });
      blogFormRef.current.toggleVisibility();
    } catch (exception) {
      dispatch({
        type: "ERROR",
        payload: "Creation failed: " + exception.message,
      });
    }
  };

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleCreate = async (event) => {
    event.preventDefault();
    await createBlog({
      title,
      author,
      url,
    });

    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={handleCreate}>
        <div>
          title:
          <input
            value={title}
            name="title"
            id="blog-title"
            data-testid="title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            value={author}
            name="author"
            data-testid="author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            value={url}
            name="url"
            data-testid="url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button
          className="py-2 px-3 my-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
          data-testid="create"
          type="submit"
        >
          create
        </button>
      </form>
    </>
  );
};

export default BlogForm;
