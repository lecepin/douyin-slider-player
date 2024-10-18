import { Button, Flex, Space, Input } from "antd";
import { PlaySquareOutlined, OrderedListOutlined } from "@ant-design/icons";
import { useLocalStorageState } from "ahooks";

import List from "./pages/List";
import Video from "./pages/Video";
import useQueryParams from "./hooks/useQueryParams";

export default () => {
  const [host, setHost] = useLocalStorageState<string | undefined>(
    "server-host",
    {
      defaultValue: "http://localhost:3000",
    }
  );
  const [qs, setQs] = useQueryParams();

  const setPageAndPush = (page: string) => {
    setQs({ page });
  };
  const page = qs.page || "";

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
          <Button
            size="large"
            color="primary"
            variant="outlined"
            block
            icon={<OrderedListOutlined />}
            onClick={() => {
              setPageAndPush("list");
            }}
          >
            清单列表
          </Button>
          <Button
            size="large"
            color="primary"
            variant="outlined"
            block
            icon={<PlaySquareOutlined />}
            onClick={() => {
              setPageAndPush("video");
            }}
          >
            视频列表
          </Button>

          <br />
          <Space.Compact>
            <Input
              addonBefore="服务器地址"
              placeholder="请输入服务器地址"
              value={host}
              onChange={(e) => setHost(e.target.value)}
            />
          </Space.Compact>
        </Flex>
      )}

      {page === "list" && <List />}
      {page === "video" && <Video />}
    </>
  );
};
