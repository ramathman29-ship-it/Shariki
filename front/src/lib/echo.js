import { API_ORIGIN } from "@/api/client";
import { session } from "./session";

const key = import.meta.env.VITE_PUSHER_KEY;
let echoPromise = null;

/**
 * Laravel Echo client for live notifications. Resolves to null when Pusher
 * isn't configured (VITE_PUSHER_KEY empty). The libraries are loaded on
 * demand so they don't weigh down the main bundle.
 * @returns {Promise<import("laravel-echo").default | null>}
 */
export function getEcho() {
  if (!key) return Promise.resolve(null);
  echoPromise ??= Promise.all([import("laravel-echo"), import("pusher-js")]).then(
    ([{ default: Echo }, { default: Pusher }]) => {
      window.Pusher = Pusher;
      return new Echo({
        broadcaster: "pusher",
        key,
        cluster: import.meta.env.VITE_PUSHER_CLUSTER || "eu",
        forceTLS: true,
        authEndpoint: `${API_ORIGIN}/broadcasting/auth`,
        auth: {
          headers: {
            get Authorization() {
              return `Bearer ${session.getToken()}`;
            },
          },
        },
      });
    }
  );
  return echoPromise;
}
