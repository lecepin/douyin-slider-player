import { useState, useEffect } from "react";

function useQueryParams() {
  const getQueryParams = () => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    return Array.from(params.keys()).reduce((acc: any, key) => {
      acc[key] = params.get(key);
      return acc;
    }, {});
  };

  const [queryData, setQueryDataState] = useState(getQueryParams());

  const setQueryData = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(window.location.search);
    Object.keys(newParams).forEach((key) => {
      const value = newParams[key];
      if (value === null || value === undefined) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    const newSearch = params.toString();
    const newUrl = `${window.location.pathname}${
      newSearch ? "?" + newSearch : ""
    }`;
    window.history.pushState({}, "", newUrl);

    const event = new Event("_pushstate");
    window.dispatchEvent(event);
    setQueryDataState(getQueryParams());
  };

  useEffect(() => {
    const onPopState = () => {
      setQueryDataState(getQueryParams());
    };
    const onPushState = () => {
      setQueryDataState(getQueryParams());
    };

    window.addEventListener("_pushstate", onPushState);
    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("_pushstate", onPushState);
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  return [queryData, setQueryData];
}

export default useQueryParams;
