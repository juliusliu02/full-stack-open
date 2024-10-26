import { createContext, useContext, useReducer } from "react";

const userReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return action.payload;
    case "CLEAR_USER":
      return null;
    default:
      return state;
  }
};

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, userDispatch] = useReducer(userReducer, null);

  return (
    <UserContext.Provider value={[user, userDispatch]}>
      {children}
    </UserContext.Provider>
  );
};
export default UserContext;
