import { useQuery } from "@apollo/client";
import { MY_FAVORITE, ALL_BOOKS } from "../queries";

const Recommendation = (props) => {
  const me = useQuery(MY_FAVORITE);
  const result = useQuery(ALL_BOOKS, {
    variables: { genre: me.data ? me.data.favoriteGenre : null },
  });
  if (!props.show) {
    return null;
  }
  const books = result.data.allBooks;
  return (
    <div>
      <h1>recommendations</h1>
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
    </div>
  );
};

export default Recommendation;
