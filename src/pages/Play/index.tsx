import { useEffect, useRef, useState } from "react";
// @ts-ignore
import { Virtual } from "swiper";
import {
  Button,
  Divider,
  Input,
  Select,
  Space,
  Modal,
  message,
  type InputRef,
} from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import axios from "axios";
import { useLocalStorageState } from "ahooks";
import Artplayer from "./Artplayer";

import "swiper/css";
import "swiper/css/virtual";
import "./index.css";

type TProps = {
  list: any[];
};

function diffArrays(a1: any, b1: any) {
  const added = b1.filter((item: any) => !a1.includes(item));
  const removed = a1.filter((item: any) => !b1.includes(item));

  if (added.length > 0 && removed.length > 0) {
    return { status: "both", added, removed };
  } else if (added.length > 0) {
    return { status: "add", added };
  } else if (removed.length > 0) {
    return { status: "del", removed };
  } else {
    return { status: "same", added: [], removed: [] };
  }
}

export default (props: TProps) => {
  const playIndexRef = useRef<number>();
  const prePlayerVideoRef = useRef<Artplayer>();
  const timePlayerRef = useRef<ITimePlayMap>({});
  const isPlay = useRef(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [favValue, setFavValue] = useState([]);
  const inputRef = useRef<InputRef>(null);
  const instanceMap = useRef<{ [key: number]: Artplayer }>({});
  const [host] = useLocalStorageState<string | undefined>("server-host", {
    defaultValue: "http://localhost:3000",
  });

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const getItems = () => {
    axios.get(host + "/playlists").then((res) => {
      setItems(
        res.data?.map((item: any) => ({
          label: item.name,
          value: item.id,
        }))
      );
    });
  };

  const addItem = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    e.preventDefault();
    axios
      .post(host + "/playlists", { name })
      .then(() => {
        setName("");
        getItems();
      })
      .catch((e) => {
        message.error(e.message);
      });
  };

  const autoplay = (index: number) => {
    if (
      playIndexRef.current !== undefined &&
      prePlayerVideoRef.current?.currentTime
    ) {
      timePlayerRef.current[playIndexRef.current] = {
        time: prePlayerVideoRef.current.currentTime,
        id: props.list[playIndexRef.current].id,
      };

      prePlayerVideoRef.current.pause?.();
      console.log(timePlayerRef.current);
    }

    const video = instanceMap.current[index];
    if (!video) return;

    const videoEl = video.video;

    if (videoEl.videoHeight / videoEl.videoWidth < 1) {
      const parentEl = videoEl.parentElement;

      if (!parentEl) return;

      parentEl.style.transform = `rotate(90deg)`;
      parentEl.style.width = window.innerHeight + "px";
      parentEl.style.height = window.innerWidth + "px";
      parentEl.parentElement!.style.width = "unset";
    }

    video.currentTime = timePlayerRef.current[index]?.time || 0;
    prePlayerVideoRef.current = video;

    video.play?.();
    isPlay.current = true;
  };

  useEffect(() => {
    getItems();
  }, []);

  return (
    <>
      <Swiper
        direction={"vertical"}
        modules={[Virtual]}
        spaceBetween={50}
        virtual
        onSwiper={(e) => {
          setTimeout(() => {
            autoplay(e.activeIndex);
          }, 1000);
          playIndexRef.current = e.activeIndex;
        }}
        onSlideChange={(e) => {
          autoplay(e.activeIndex);
          playIndexRef.current = e.activeIndex;
        }}
      >
        {props.list.map((item, index) => (
          <SwiperSlide key={item.name}>
            <Artplayer
              option={{
                url: host + item.url,
                muted: false,
                autoplay: true,
                pip: false,
                autoSize: true,
                setting: false,
                loop: true,
                mutex: true,
                fullscreen: true,
                fastForward: true,
                autoOrientation: true,
                layers: [
                  {
                    name: "potser",
                    html: `<button style="opacity: 0.1">收藏</button>`,
                    tooltip: "Potser Tip",
                    style: {
                      position: "absolute",
                      top: "50px",
                      right: "50px",
                    },
                    click: function () {
                      setFavValue(item.lists.map((it: any) => it.id));
                      setIsModalOpen(true);
                    },
                  },
                ],
              }}
              style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                alignItems: "center",
              }}
              getInstance={(art: Artplayer) =>
                (instanceMap.current[index] = art)
              }
            />
            <div className="title">{item.name}</div>
          </SwiperSlide>
        ))}
      </Swiper>

      <Modal
        title="播放清单"
        footer={false}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
      >
        <Select
          mode="multiple"
          style={{ width: 300 }}
          placeholder="选择清单"
          dropdownRender={(menu) => (
            <>
              {menu}
              <Divider style={{ margin: "8px 0" }} />
              <Space style={{ padding: "0 8px 4px" }}>
                <Input
                  placeholder="输入项目名称"
                  ref={inputRef}
                  value={name}
                  onChange={onNameChange}
                  onKeyDown={(e) => e.stopPropagation()}
                />
                <Button type="text" onClick={addItem}>
                  添加项目
                </Button>
              </Space>
            </>
          )}
          value={favValue}
          onChange={(value) => {
            const { status, removed, added } = diffArrays(favValue, value);
            setFavValue(value);

            if (status === "add") {
              axios.post(
                host +
                  `/playlists/${added[0]}/videos/${
                    props.list[playIndexRef.current!].name
                  }`
              );
            } else if (status === "del") {
              axios.delete(
                host +
                  `/playlists/${removed[0]}/videos/${
                    props.list[playIndexRef.current!].name
                  }`
              );
            }
          }}
          options={items}
        />
      </Modal>
    </>
  );
};
