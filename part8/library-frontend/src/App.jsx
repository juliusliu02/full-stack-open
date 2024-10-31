import { useEffect, useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Notify from "./components/Notify";
import { useApolloClient } from "@apollo/client";
import Recommendation from "./components/Recommendation";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const client = useApolloClient();

  const notify = (message) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  useEffect(() => {
    const token = localStorage.getItem("library-user-token");
    if (token) {
      setToken(token);
    }
  }, []);

  if (page === "login") {
    return (
      <div>
        <Notify errorMessage={error} />
        <h2>Login</h2>
        <LoginForm setPage={setPage} setToken={setToken} setError={notify} />
      </div>
    );
  }

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
    setPage("authors");
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token === null ? (
          <button onClick={() => setPage("login")}>log in</button>
        ) : (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("recommended")}>recommended</button>
            <button onClick={logout}>logout</button>
          </>
        )}
      </div>

      <Notify errorMessage={error} />

      <Authors show={page === "authors"} notify={notify} />

      <Books show={page === "books"} notify={notify} />

      <NewBook show={page === "add"} notify={notify} />

      <Recommendation show={page === "recommended"} notify={notify} />
    </div>
  );
};

export default App;
