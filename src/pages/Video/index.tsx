import { useState, useEffect } from "react";
import { message, List, Input } from "antd";
import { useLocalStorageState } from "ahooks";
import axios from "axios";

import useQueryParams from "./../../hooks/useQueryParams";
import Play from "./../Play";

export default () => {
  const [host] = useLocalStorageState<string | undefined>("server-host", {
    defaultValue: "http://localhost:3000",
  });
  const [qs, setQs] = useQueryParams();
  const [list, setList] = useState<any[]>([]);
  const [searchList, setSearchList] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [playIndex, setPlayIndex] = useState(0);

  useEffect(() => {
    axios
      .get(host + "/videos?listId=" + (qs.listId || ""))
      .then((res) => {
        setList(res.data);
        if (!searchList.length) {
          setSearchList(res.data);
        }
      })
      .catch((e) => {
        message.error(e.message);
      });
  }, [qs?.play]);

  return (
    <div className="p10px">
      {qs?.play !== "1" ? (
        <div>
          <Input
            addonBefore="搜索"
            placeholder="输入新列表项"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setSearchList(
                list.filter((item) =>
                  item.name.toLowerCase().includes(e.target.value.toLowerCase())
                )
              );
            }}
          />
          <List
            className="mt10px"
            bordered
            size="small"
            itemLayout="horizontal"
            dataSource={searchList}
            renderItem={(item, index) => (
              <List.Item>
                <div
                  className="flex-grow-1"
                  onClick={() => {
                    setPlayIndex(index);
                    setQs({
                      play: "1",
                    });
                  }}
                >
                  {item.name}
                </div>
              </List.Item>
            )}
          />
        </div>
      ) : (
        <Play list={searchList} index={playIndex} />
      )}
    </div>
  );
};
