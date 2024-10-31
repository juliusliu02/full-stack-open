import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ALL_AUTHORS, SET_BORN_TO } from "../queries";

const BirthYearForm = ({ authors, notify }) => {
  const [bornYear, setBornYear] = useState("");

  const [setBornTo] = useMutation(SET_BORN_TO, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      notify(error.graphQLErrors[0].message);
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    const born = parseInt(bornYear);
    setBornTo({ variables: { name, born } });
    setBornYear("");
  };

  return (
    <div className="birthYearForm">
      <h3>Set birthyear</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <select name="name">
            {authors.map((author) => (
              <option key={author.name} value={author.name}>
                {author.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          born{" "}
          <input
            value={bornYear}
            onChange={({ target }) => setBornYear(target.value)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default BirthYearForm;
