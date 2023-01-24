import { useEffect, useRef, useState } from "react";
import { Virtual } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/virtual";
import "./index.less";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [playlist, setPlaylist] = useState<Array<IPlayListItem>>([]);
  const playIndexRef = useRef<number>();
  const prePlayerVideoRef = useRef<HTMLVideoElement>();
  const timePlayerRef = useRef<ITimePlayMap>({});
  const isPlay = useRef(false);

  useEffect(() => {
    fetch("playlist.json")
      .then((res) => res.json())
      .then((res) => {
        setPlaylist(res);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const autoplay = (swiper, index) => {
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

    const video = swiper.visibleSlides?.[0]?.querySelector("video");

    if (!video) return;

    if (video.videoHeight / video.videoWidth < 1) {
      video.style.transform = `rotate(90deg)`;
      video.style.maxWidth = window.innerHeight + "px";
      video.style.maxHeight = window.innerWidth + "px";
    }

    video.currentTime = timePlayerRef.current[index]?.time || 0;
    prePlayerVideoRef.current = video;

    video.play?.();
    isPlay.current = true;
  };

  return (
    <>
      {isLoading ? (
        "加载中…"
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
          {playlist.map((item) => (
            <SwiperSlide>
              <video
                // style={{ opacity: 1 }}
                // preload="metadata"
                // controls
                // x5-playsinline="true"
                // x5-video-player-type="h5"
                // x-webkit-airplay="allow"
                // webkit-playsinline="true"
                // playsInline
                src={item.path}
                poster={item.poster}
                loop
                onClick={(e) => {
                  if (isPlay.current) {
                    (e.target as HTMLVideoElement).pause();
                    isPlay.current = false;
                  } else {
                    (e.target as HTMLVideoElement).play();
                    isPlay.current = true;
                  }
                }}
              ></video>
              <div className="title">{item.title}</div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </>
  );
}
