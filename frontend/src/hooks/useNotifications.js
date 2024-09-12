import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectError, selectSuccess } from "../redux/auth/authSelectors.js";
import { toast } from "react-toastify";

const useNotifications = () => {
  const error = useSelector(selectError);
  const success = useSelector(selectSuccess);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      toast.success(success);
    }
  }, [success]);
};

export default useNotifications;
