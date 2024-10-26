import { useNotificationValue } from "../NotificationContext";

const Notification = () => {
  const message = useNotificationValue();

  if (message === null) return null;

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

  if (message.type === "success") {
    return <div style={success}>{message.body}</div>;
  }

  if (message.type === "error") {
    return <div style={error}>{message.body}</div>;
  }
};

export default Notification;
