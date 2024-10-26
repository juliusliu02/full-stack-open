import NotificationContext from "../NotificationContext";
import { useContext } from "react";

const Notification = () => {
  const [message, dispatch] = useContext(NotificationContext);

  if (!message) return null;

  setTimeout(() => dispatch({ type: "CLEAR" }), 5000);

  const success = {
    color: "green",
    fontStyle: "italic",
    fontSize: 16,
  };

  const error = {
    color: "red",
    fontStyle: "italic",
    fontSize: 16,
  };

  if (message.type === "SUCCESS") {
    return <div style={success}>{message.body}</div>;
  }

  if (message.type === "ERROR") {
    return <div style={error}>{message.body}</div>;
  }
};

export default Notification;
