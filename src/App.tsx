import { useEffect, useState } from "react";
import { Button, Flex } from "antd";
import Play from "./pages/Play";

export default () => {
  const [page, setPage] = useState("");

  useEffect(() => {
    const backFn = () => {
      setPage("");
    };

    window.addEventListener("popstate", backFn);

    return () => {
      window.removeEventListener("popstate", backFn);
    };
  }, []);
  return (
    <>
      {!page && (
        <Flex
          vertical
          gap="small"
          justify="center"
          style={{
            width: "100%",
            height: "100vh",
            padding: 10,
            boxSizing: "border-box",
          }}
        >
          <Button block>清单列表</Button>
          <Button block>视频列表</Button>
          <Button
            block
            onClick={() => {
              setPage("video");
              window.history.pushState(null, "", "?" + Math.random());
            }}
          >
            全部播放
          </Button>
        </Flex>
      )}

      {page === "video" && <Play />}
    </>
  );
};
