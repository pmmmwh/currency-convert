import * as React from "react";
import { useQuery } from "react-query";
import { fetcher } from "../utils";
import type { LoginInfo } from "@currency-convert/types";
import type { PropsWithChildren } from "react";
import Loading from "../components/Loading";
import Snackbar from "../components/Snackbar";
import { useContext } from "react";

const AuthContext = React.createContext<LoginInfo | undefined>(undefined);

export function useAuth() {
  const authInfo = useContext(AuthContext);
  // Guard against context initialization
  if (!authInfo) {
    throw new Error("`useAuth` can only be used in children of `AuthProvider`!");
  }

  return authInfo;
}

function AuthProvider({ children }: PropsWithChildren<{}>) {
  // Snack Bar
  const [errorSnackbarOpen, setErrorSnackbarOpen] = React.useState(false);

  // JWT Fetching
  const { clear, data, isError, isIdle, isLoading, refetch } = useQuery(
    "login",
    (url: string) => fetcher<LoginInfo>(url, { method: "POST" }),
    // Disable auto-revalidation of the queried data
    { enabled: false }
  );

  // Ensure the fetching query is only ran once on mount
  React.useEffect(() => {
    void refetch();
  }, []);

  // Memoize data to prevent recalculation down the tree
  const memoizedData = React.useMemo(() => data, [data]);

  function handleSnackbarClose() {
    clear();
    setErrorSnackbarOpen(false);
  }

  if (isIdle || isLoading) {
    return <Loading open />;
  }

  if (isError) {
    return (
      <Snackbar open={errorSnackbarOpen} onClose={handleSnackbarClose}>
        Something went wrong!
        <br />
        Please refresh to try again!
      </Snackbar>
    );
  }

  return <AuthContext.Provider value={memoizedData}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
