import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <nav className="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between">
          <p className="flex-none font-semibold text-xl text-black focus:outline-none focus:opacity-80 dark:text-white">
            My Bloglist
          </p>
          <div className="flex flex-row items-center gap-5 mt-5 sm:justify-end sm:mt-0 sm:ps-5">
            <Link
              className="font-medium text-gray-600 hover:text-gray-400 focus:outline-none focus:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
              to="/"
              aria-current="page"
            >
              Blogs
            </Link>
            <Link
              className="font-medium text-gray-600 hover:text-gray-400 focus:outline-none focus:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
              to="/Users"
              aria-current="page"
            >
              Users
            </Link>
          </div>
        </nav>
      </nav>
    </header>
  );
};

export default Navigation;
