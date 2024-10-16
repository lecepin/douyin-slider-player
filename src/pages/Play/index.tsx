import { useEffect, useRef, useState } from "react";
import { Virtual } from "swiper";
import {
  Button,
  Divider,
  Input,
  Select,
  Space,
  Modal,
  message,
  Spin,
  type InputRef,
} from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import Artplayer from "./Artplayer";

import "swiper/css";
import "swiper/css/virtual";
import "./index.less";

export default () => {
  const [isLoading, setIsLoading] = useState(true);
  const [playlist, setPlaylist] = useState<Array<IPlayListItem>>([]);
  const playIndexRef = useRef<number>();
  const prePlayerVideoRef = useRef<HTMLVideoElement>();
  const timePlayerRef = useRef<ITimePlayMap>({});
  const isPlay = useRef(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState(["默认", "学习"]);
  const [name, setName] = useState("");
  const [favValue, setFavValue] = useState([]);
  const inputRef = useRef<InputRef>(null);
  const instanceMap = {};

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const addItem = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    e.preventDefault();

    if (items.includes(name)) {
      message.warning("重复名称");
      return;
    }

    // todo: 更新 api

    setItems([...items, name]);
    setName("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const autoplay = (_, index) => {
    if (
      playIndexRef.current !== undefined &&
      prePlayerVideoRef.current?.currentTime
    ) {
      timePlayerRef.current[playIndexRef.current] = {
        time: prePlayerVideoRef.current.currentTime,
        id: playlist[playIndexRef.current].id,
      };

      prePlayerVideoRef.current.pause?.();
      console.log(timePlayerRef.current);
    }

    const video = instanceMap[index];
    if (!video) return;

    const videoEl = video.video;

    if (videoEl.videoHeight / videoEl.videoWidth < 1) {
      const parentEl = videoEl.parentElement;

      parentEl.style.transform = `rotate(90deg)`;
      parentEl.style.width = window.innerHeight + "px";
      parentEl.style.height = window.innerWidth + "px";
      parentEl.parentElement.style.width = "unset";
    }

    video.currentTime = timePlayerRef.current[index]?.time || 0;
    prePlayerVideoRef.current = video;

    video.play?.();
    isPlay.current = true;
  };

  useEffect(() => {
    // 取播放清单
    // setItems

    // 取相应的视频列表
    fetch("playlist.json")
      .then((res) => res.json())
      .then((res) => {
        setPlaylist(res);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      {isLoading ? (
        <Spin />
      ) : (
        <Swiper
          direction={"vertical"}
          modules={[Virtual]}
          spaceBetween={50}
          virtual
          onSwiper={(e) => {
            setTimeout(() => {
              autoplay(e, e.activeIndex);
            }, 50);
            playIndexRef.current = e.activeIndex;
          }}
          onSlideChange={(e) => {
            autoplay(e, e.activeIndex);
            playIndexRef.current = e.activeIndex;
          }}
        >
          {playlist.map((item, index) => (
            <SwiperSlide>
              <Artplayer
                option={{
                  url: item.path,
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
                      click: function (...args) {
                        // todo: 当前视频的归类清单
                        // get api
                        // setFavValue
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
                getInstance={(art) => (instanceMap[index] = art)}
              />
              <div className="title">{item.title}</div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

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
            setFavValue(value);
            // todo: 更新 api
          }}
          options={items.map((item) => ({ label: item, value: item }))}
        />
      </Modal>
    </>
  );
};
