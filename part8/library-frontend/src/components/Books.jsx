import { useQuery, useSubscription } from "@apollo/client";
import { ALL_BOOKS, ALL_GENRES, BOOK_ADDED } from "../queries";
import { useState } from "react";

export const updateCache = (cache, query, addedBook) => {
  const uniqByName = (a) => {
    let seen = new Set();
    return a.filter((item) => {
      let k = item.title;
      return seen.has(k) ? false : seen.add(k);
    });
  };

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByName(allBooks.concat(addedBook)),
    };
  });
};

const Books = (props) => {
  const [genre, setGenre] = useState("");

  const result = useQuery(ALL_BOOKS, {
    variables: { genre: genre === "" ? undefined : genre },
  });

  const genres = useQuery(ALL_GENRES);

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded;
      window.alert(`${addedBook.title} added`);
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook);
    },
  });

  if (!props.show) {
    return null;
  }

  if (result.loading || genres.loading) {
    return <div>loading...</div>;
  }

  const books = result.data.allBooks;

  return (
    <div>
      <h2>books</h2>
      {genre === "" ? null : `in genre ${genre}`}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>genre</h3>
      {genres.data.allGenres.map((genre) => (
        <button key={genre} onClick={() => setGenre(genre)}>
          {genre}
        </button>
      ))}
    </div>
  );
};

export default Books;
