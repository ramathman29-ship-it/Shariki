import { useCallback, useEffect, useState } from "react";
import { notificationsApi } from "@/api";
import { getEcho } from "@/lib/echo";
import useAuth from "./useAuth";
import useToast from "./useToast";

/** Notifications for the signed-in user: initial list + live updates via Echo. */
export default function useNotifications() {
  const { user, isLoggedIn } = useAuth();
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!isLoggedIn) {
      setItems([]);
      setUnread(0);
      return;
    }
    let active = true;
    notificationsApi
      .list()
      .then(({ items, unread }) => {
        if (!active) return;
        setItems(items);
        setUnread(unread);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [isLoggedIn]);

  useEffect(() => {
    if (!user?.id) return;
    const channel = `App.Models.User.${user.id}`;
    let echo = null;
    let cancelled = false;
    getEcho().then((instance) => {
      if (!instance || cancelled) return;
      echo = instance;
      echo.private(channel).notification((n) => {
        setItems((prev) => [n, ...prev]);
        setUnread((c) => c + 1);
        toast.success(n.message);
      });
    });
    return () => {
      cancelled = true;
      echo?.leave(channel);
    };
  }, [user?.id, toast]);

  const markOneRead = useCallback(() => setUnread((c) => Math.max(c - 1, 0)), []);

  return { items, unread, markOneRead };
}
