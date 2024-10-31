import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../queries";

const LoginForm = ({ setError, setToken, setPage }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message);
    },
  });

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      setToken(token);
      setPage("authors");
      localStorage.setItem("library-user-token", token);
    }
  }, [result.data]);

  const handleLogin = (event) => {
    event.preventDefault();
    login({ variables: { username, password } });
  };

  return (
    <form onSubmit={handleLogin}>
      <div>
        name
        <input
          type="text"
          name="input"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          name="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );
};

export default LoginForm;
