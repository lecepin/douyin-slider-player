import { Input, message, List, Button, Popconfirm } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import { useLocalStorageState } from "ahooks";

import useQueryParams from "./../../hooks/useQueryParams";

export default () => {
  const [, setQs] = useQueryParams();
  const [list, setList] = useState<{ name: string; id: number }[]>([]);
  const [addValue, setAddValue] = useState<string>("");
  const [host] = useLocalStorageState<string | undefined>("server-host", {
    defaultValue: "http://localhost:3000",
  });
  const getPlaylists = () => {
    axios
      .get(host + "/playlists")
      .then((res) => {
        setList(res.data);
      })
      .catch((e) => {
        message.error(e.message);
      });
  };

  useEffect(() => {
    getPlaylists();
  }, []);

  return (
    <div className="p10px">
      <Input.Search
        placeholder="输入新列表项"
        value={addValue}
        onChange={(e) => {
          setAddValue(e.target.value);
        }}
        onSearch={(value) => {
          axios
            .post(host + "/playlists", { name: value })
            .then(() => {
              setAddValue("");
              getPlaylists();
            })
            .catch((e) => {
              message.error(e.message);
            });
        }}
        enterButton="添加"
      />

      <List
        className="mt10px"
        bordered
        size="small"
        itemLayout="horizontal"
        dataSource={list}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Popconfirm
                title="删除"
                description="确定删除?"
                okText="Yes"
                cancelText="No"
              >
                <Button color="danger" variant="link">
                  删除
                </Button>
              </Popconfirm>,
            ]}
          >
            <div
              className="flex-grow-1"
              onClick={() => {
                setQs({ page: "video", listId: item.id });
              }}
            >
              {item.name}
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};
