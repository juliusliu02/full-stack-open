import { Link } from "react-router-dom";
import { useState } from "react";
import blogService from "../services/blogs";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const CommentForm = ({ blog }) => {
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");

  const commentMutation = useMutation({
    mutationFn: ({ blog, comment }) => {
      return blogService.comment(blog, comment);
    },
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(
        ["blogs"],
        blogs.map((blog) => (blog.id === newBlog.id ? newBlog : blog)),
      );
    },
  });

  const handleComment = (e) => {
    e.preventDefault();
    console.log(comment);
    // mutationFn only takes one argument, passing as object.
    commentMutation.mutate({ blog, comment });
    setComment("");
  };

  return (
    <div>
      <form onSubmit={handleComment}>
        <input
          value={comment}
          name="title"
          id="blog-title"
          data-testid="title"
          onChange={({ target }) => setComment(target.value)}
        />
        <button type="submit">add comment</button>
      </form>
    </div>
  );
};

export const Blog = ({ blog, updateBlog, user, deleteBlog }) => {
  if (!blog) return null;

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
    <div className="blog">
      <div>
        <h2 className="text-3xl dark:text-white">{blog.title}</h2>
        <p className="text-md my-1 dark:text-white">{blog.url}</p>
        <p className="text-md my-1 dark:text-white">
          {"likes " + blog.likes}
          <button
            onClick={like}
            type="button"
            className="py-2 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-none focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:text-blue-400"
          >
            like
          </button>
        </p>
        <p>{blog.author}</p>
        <p>added by {blog.user.name}</p>
        {user.username === blog.user.username ? (
          <button
            className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:bg-red-600 disabled:opacity-50 disabled:pointer-events-none"
            onClick={handleDelete}
          >
            remove
          </button>
        ) : null}
        <h3 className="text-2xl py-4 dark:text-white">Comments</h3>
        <CommentForm blog={blog} />
        <div>
          <ul className="list-none list-inside text-gray-800 dark:text-white">
            {blog.comments.map((comment) => (
              <li>{comment}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export const Blogs = ({ blogs }) => {
  if (!blogs) return null;

  return (
    <>
      {blogs
        .sort((a, b) => a.likes - b.likes)
        .reverse()
        .map((blog) => (
          <div
            className="flex flex-col my-3 bg-white border border-gray-200 shadow-sm rounded-xl p-4 md:p-5 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
            key={blog.id}
          >
            <Link to={"blogs/" + blog.id}>{blog.title}</Link>
          </div>
        ))}
    </>
  );
};
