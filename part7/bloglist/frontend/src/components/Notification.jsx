import NotificationContext from "../NotificationContext";
import { useContext } from "react";

const Notification = () => {
  const [message, dispatch] = useContext(NotificationContext);

  if (!message) return null;

  setTimeout(() => dispatch({ type: "CLEAR" }), 5000);

  const success =
    "mt-2 bg-teal-100 border border-teal-200 text-sm text-teal-800 rounded-lg p-4 dark:bg-teal-800/10 dark:border-teal-900 dark:text-teal-500";

  const error =
    "mt-2 bg-red-100 border border-red-200 text-sm text-red-800 rounded-lg p-4 dark:bg-red-800/10 dark:border-red-900 dark:text-red-500";

  if (message.type === "SUCCESS") {
    return <div className={success}>{message.body}</div>;
  }

  if (message.type === "ERROR") {
    return <div className={error}>{message.body}</div>;
  }
};

export default Notification;
