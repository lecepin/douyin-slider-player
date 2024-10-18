import { useState, useEffect } from "react";
import { message, List, Button } from "antd";
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
  const [playList, setPlayList] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get(host + "/videos?listId=" + (qs.listId || ""))
      .then((res) => {
        setList(res.data);
      })
      .catch((e) => {
        message.error(e.message);
      });
  }, [qs?.play]);

  return (
    <div className="p10px">
      {qs?.play !== "1" ? (
        <div>
          <Button
            type="primary"
            onClick={() => {
              setPlayList(list);
              setQs({
                play: "1",
              });
            }}
          >
            播放全部
          </Button>

          <List
            className="mt10px"
            bordered
            size="small"
            itemLayout="horizontal"
            dataSource={list}
            renderItem={(item) => (
              <List.Item>
                <div
                  className="flex-grow-1"
                  onClick={() => {
                    setPlayList([item]);
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
        <Play list={playList} />
      )}
    </div>
  );
};
