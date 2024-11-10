import { Button, CircularProgress, Divider, Fade, Grow, IconButton } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { Alegreya_Sans_SC, Old_Standard_TT } from 'next/font/google'
import useSWR from 'swr';
import { DateTime } from 'luxon';
import InfiniteScroll from 'react-infinite-scroll-component';
import RefreshIcon from '@mui/icons-material/Refresh';
import Link from 'next/link';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TwitterIcon from '@mui/icons-material/Twitter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBluesky, faFacebook, faInstagram, faTwitch } from '@fortawesome/free-brands-svg-icons';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
// import { Logo } from '@/svg/Logo';

import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { LeftNav } from '@/svg/LeftNav';
import { BadgeBody } from '@/svg/badge/body';
import { CocoaBottom } from '@/svg/badge/bottom/cocoaB';
import { CocoaTop } from '@/svg/badge/top/cocoaT';
import { MomijiTop } from '@/svg/badge/top/momijiT';
import { MomijiBottom } from '@/svg/badge/bottom/momijiB';
import { StarTop } from '@/svg/badge/top/starT';
import { StarBottom } from '@/svg/badge/bottom/starB';
import { PorkTop } from '@/svg/badge/top/porkT';
import { PorkBottom } from '@/svg/badge/bottom/porkB';
import { CpuTop } from '@/svg/badge/top/cpuT';
import { CpuBottom } from '@/svg/badge/bottom/cpuB';

//

const oldStandard = Old_Standard_TT({ weight : '400', subsets : ['latin'] })
const alegreya = Alegreya_Sans_SC({ weight : '400', subsets : ['latin'] })

export default function Page() {
  const [lastSwap, setLastSwap] = useState<DateTime>(DateTime.now())
  const [now, setNow] = useState<DateTime>(DateTime.now())
  const [openEye, setOpenEye] = useState(true)

  // new for writing box
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const [userName, setUserName] = useState('');
  const userNameRef = useRef<HTMLTextAreaElement>(null);
  const [userComment, setUserComment] = useState('');
  const userCommentRef = useRef<HTMLTextAreaElement>(null);

  const pageSize = 10
  const swapTime = 5
  const [page, setPage] = useState(1)
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  const banners = [
    {
      id: "dee279c3-351e-46a2-b20b-77315dcfade0",
      name: "hyouga-keychain",
      url: "https://shop.realic.net/products/2024-november-birthday-event?variant=49287100432664",
      imgURL: "/img/banner/birthday-good.png",
      order: 1
    },
    {
      id: "dee279c3-351e-46a2-b20b-77315dcfade0",
      name: "hyouvember",
      url: "https://x.com/search?q=%23%E0%B9%80%E0%B8%AE%E0%B8%B5%E0%B8%A2%E0%B8%A7%E0%B9%80%E0%B8%A7%E0%B8%A1%E0%B9%80%E0%B8%9A%E0%B8%AD%E0%B8%A3%E0%B9%8C&src=typeahead_click",
      imgURL: "/img/banner/hyouvember.jpg",
      order: 2
    },
    {
      id: "aa90961a-cfb0-422c-b7ea-50474a71235e",
      name: "cafe-project",
      url: "https://x.com/CNubdao12251",
      imgURL: "/img/banner/cafe.png",
      order: 3
    },
    {
      id: "5fae0719-5365-4baa-bc3e-4a8cbe5cb7e4",
      name: "blooming-cat",
      url: "https://x.com/BloomingCat__",
      imgURL: "/img/banner/BloomingCat_Banner.png",
      order: 4
    },
    {
      id: "6f82c72d-4598-4de3-9f45-1cdb83f65892",
      name: "game",
      url: "https://play.unity.com/en/games/742ac3a9-3679-4a94-8327-6ccf7018986f/tape-the-cats",
      imgURL: "/img/banner/TapeTheCats.png",
      order: 5
    },
    {
      id: "8d3ab3b5-769d-4ab5-b06e-003bf8f2ad3a",
      name: "unknown",
      url: "",
      imgURL: "/img/banner/Unknown.png",
      order: 6
    }
  ]

  const handleResize = () => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  useEffect(() => {
    // Update Every Second
    const interval = setInterval(() => {
      setNow(DateTime.now())
    }, 1000)

    window.addEventListener("resize", handleResize);
    handleResize()
    
    return () => {
      window.removeEventListener('resize', handleResize)
      if(interval){
        clearInterval(interval);
      }
    }
  },[])

  useEffect(()=>{
    setLastSwap(DateTime.now())
  }, [openEye])

  useEffect(()=>{
    if(lastSwap.diffNow(['seconds']).seconds < (swapTime*-1)){
      setOpenEye(!openEye)
    }
  }, [now])
  
  // new for writing box
  const handleOpenModal = () => {
    if(isModalOpen)
    {
      handleCloseModal();
    }
    else
    {
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setUserName('');
    setUserComment('');
    setSelectedImageId(null);
  };

  const uuid = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  };

const handleSubmit = async () => {
  if(userName==="" && userNameRef.current)
  {
    userNameRef.current.focus();
    return;
  }
  if(userComment==="" && userCommentRef.current)
  {
    userCommentRef.current.focus();
    return;
  }
  if(!selectedImageId) {
    return;
  }

  const timestamp = new Date().toISOString();
  const id = uuid();

  // Create the new post object
  const newPost = {
    id,
    name: userName,
    comment: userComment,
    giftId: gifts[selectedImageId - 1].id,
    createdAt: timestamp,
    gift: gifts[selectedImageId - 1]
  };

  try {
    const response = await fetch('/post.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPost)
    });

    if (!response.ok) {
      throw new Error('Failed to save post');
    }

    // Trigger a revalidation of the data
    postMutate();
    handleCloseModal();
  } catch (error) {
    console.error('Error saving post:', error);
    // Optionally add error handling UI here
  }
};

  const gifts = [
    {
      id: "ba8a1955-5f71-4cde-9886-62fc829784a1",
      name: "cocoa",
      desc: "โกโก้ร้อนช่วยให้ร่างกายอุ่น แต่รอยยิ้มคุณช่วยให้อุ่นใจ",
      imgURL:
        "/img/Sticker/Cocoa.png",
      bgColorCode: "white",
      borderColor: "#B44137",
      order: 1
    },
    {
      id: "04fc6ec8-abc6-4328-9dce-66aaf8516c64",
      name: "momiji",
      desc: "ใบไม้อาจมีเปลี่ยนสี แต่คำว่า ‘รัก’ ที่สกม.มีไม่เคยเปลี่ยนไป",
      imgURL:
        "/img/Sticker/Manju.png",
      bgColorCode: "white",
      borderColor: "#AA613F",
      order: 2
    },
    {
      id: "32671e3c-59fb-4972-8926-18f5751efe16",
      name: "star",
      desc: "คืนที่ดาวเต็มฟ้า ฉันจินตนาการเป็นหน้าเธอ",
      imgURL:
        "/img/Sticker/Star.png",
      bgColorCode: "white",
      borderColor: "#CFBB41",
      order: 3
    },
    {
      id: "46fd5699-ccb1-4882-b5ad-469b8491747a",
      name: "pork",
      desc: "หมูปิ้งร้อนๆก็ยังไม่ฮ็อตเท่าพี่",
      imgURL:
        "/img/Sticker/Grilled pork.png",
      bgColorCode: "white",
      borderColor: "#2A5421",
      order: 4
    },
    {
      id: "6916f01c-2287-4637-aa57-65b7886dc368",
      name: "cpu",
      desc: "คุณมีงบเท่าไหร่ แลกหัวใจคุณแทนได้ไหมคะ",
      imgURL:
        "/img/Sticker/PC RGB.png",
      bgColorCode: "white",
      borderColor: "#5A7397",
      order: 5
    },
  ];

  
  //end new
  const swiperRef = useRef<SwiperClass | null>(null);

  const { data:postData, error:postError, isLoading:postIsLoading, isValidating:postIsValidating, mutate:postMutate } = useSWR('/post.json', async (url) => {
    setPage(0)
    const res = await fetch(url)
    if(!res.ok){
        return {
            data : [],
            total : 0
        }
    }
    setPage(1)
    return (await res.json()) as {
      data : {
        id : string,
        name : string,
        comment : string
        giftId : string,
        createdAt : string,
        gift : {
          id: string;
          name: string;
          desc: string | null;
          imgURL: string;
          bgColorCode: string;
          borderColor: string;
          order: number;
        }
      }[],
      total : number
    }
  },{
    revalidateOnMount : true,
    revalidateOnFocus : false
  })


  return (
    <div className="flex flex-col w-full items-center">
      <div
        className={`flex flex-col min-h-screen w-full overflow-x-hidden z-[1] pt-6 pb-16 gap-4 text-[#000000] items-center`}
      >
        {/* <div
          className="flex flex-col w-full items-center relative"
          style={{ height: "500px" }}
        > */}
          <div
            className="flex flex-col w-full items-center relative aspect-[2/1]"
          >
          {/* <div
            className="hover:cursor-pointer"
            onClick={() => {
              setOpenEye(!openEye);
            }}
          >
            <div className={openEye ? "" : "hidden"}>
              <img
                className="hover:cursor-pointer min-[260px]:w-[260px] w-full"
                src={"/img/baku_head.png"}
                alt={"baku-bd-chibi"}
              />
            </div>
            <div className={openEye ? "hidden" : ""}>
              <img
                className="hover:cursor-pointer min-[260px]:w-[260px] w-full"
                src={"/img/baku_head_open.png"}
                alt={"baku-bd-chibi"}
              />
            </div>
          </div> */}
          <div className="relative w-full sm:h-[150px] min-[500px]:h-[130px] min-[425px]:h-[100px] h-[80px]">
            <Fade
              in={true}
              className="text-center absolute -translate-x-[50%] left-[50%] flex flex-col w-full h-fit"
            >
              <img
                className="absolute min-w-[650px] min-h-[360px] top-0 left-[50%] -translate-x-[50%] -z-[2]"
                src="/img/RedScreen.png"
              />
            </Fade>
          </div>
        </div>
        <div className="head-text">
          <h2>Happy Hyouga Day!</h2>
          <h4>= 22 Nov 2024 =</h4>
        </div>
        <div className="min-[1901px]:w-full sm:w-[1900px] w-full relative">
          <IconButton
            disableRipple
            className=" hover:bg-transparent absolute z-[2] text-white top-[50%] lg:right-[calc(50%-450px)] sm:right-[calc(50%-280px)] min-[425px]:right-[20px] right-[0px] p-0 -translate-y-[50%] translate-x-[50%] w-[100px] h-[100px]"
            onClick={() => swiperRef.current?.slideNext()}
          >
            <div className="p-0 w-full h-full flex items-center justify-start">
              <LeftNav className="md:w-16 md:h-16 min-[425px]:w-12 w-10 min-[425px]:h-12 h-10 z-[1] rotate-180" />
            </div>
          </IconButton>
          <IconButton
            disableRipple
            className=" hover:bg-transparent absolute z-[2] text-white top-[50%] lg:left-[calc(50%-450px)] sm:left-[calc(50%-280px)] min-[425px]:left-[20px] left-[0px] p-0 -translate-y-[50%] -translate-x-[50%] w-[100px] h-[100px]"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <div className="p-0 w-full h-full flex items-center justify-end">
              <LeftNav className="md:w-16 md:h-16 min-[425px]:w-12 w-10 min-[425px]:h-12 h-10 z-[1]" />
            </div>
          </IconButton>
          <Swiper
            onSwiper={(swiper: SwiperClass) => {
              swiperRef.current = swiper;
            }}
            slidesPerView={dimensions.width >= 640 ? 3 : 1}
            spaceBetween={0}
            centeredSlides={true}
          >
            {banners.map((banner) => (
              <SwiperSlide key={banner.id} className="aspect-video ">
                {({ isActive, isPrev, isNext }) => (
                  <div>
                    {banner.url && (
                      <Link
                        className={`${isActive ? "" : "brightness-50"} ${
                          isPrev || isNext || isActive
                            ? "opacity-100"
                            : "opacity-0"
                        } transition`}
                        href={banner.url}
                        target="_blank"
                      >
                        <img
                          src={banner.imgURL}
                          className={`transition ease-linear sm:rounded-[50px] w-full object-cover aspect-video ${
                            isActive ? "" : "scale-75"
                          }`}
                        />
                      </Link>
                    )}
                    {!banner.url && (
                      <div
                        className={`${isActive ? "" : "brightness-50"} ${
                          isPrev || isNext || isActive
                            ? "opacity-100"
                            : "opacity-0"
                        } transition`}
                      >
                        <img
                          src={banner.imgURL}
                          className={`transition ease-linear sm:rounded-[50px] w-full object-cover aspect-video ${
                            isActive ? "" : "scale-75"
                          }`}
                        />
                      </div>
                    )}
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        {/* button for writing */}
        {!isModalOpen && (
          <button onClick={handleOpenModal} className="writing-btn">
            <FontAwesomeIcon
              className="text-[20px] aspect-square"
              icon={faPencilAlt}
            />
            &nbsp; ร่วมแปะคำอวยพร
          </button>
        )}
        {isModalOpen && (
          <div
            className="modal-overlay"
            onClick={(e) => e.target === e.currentTarget && handleCloseModal()}
          >
            <div className="modal-content">
              <span className="close-btn" onClick={handleCloseModal}>
                &times;
              </span>
              <div className="select-gift">
                <h2>เลือกของขวัญ</h2>
                <div className="image-buttons">
                  {gifts.map((gift) => (
                    <button
                      key={gift.order}
                      onClick={() => setSelectedImageId(gift.order)}
                      className={`image-button ${
                        selectedImageId === gift.order ? "selected" : ""
                      }`}
                      style={{
                        borderColor:
                          selectedImageId === gift.order
                            ? gift.borderColor
                            : "white",
                      }}
                    >
                      <img
                        src={gift.imgURL}
                        alt={`Image ${gift.order}`}
                        style={{ width: "80px", height: "80px" }}
                      />
                    </button>
                  ))}
                </div>
                <div className="gift-desc">
                  {gifts.map((gift) =>
                    selectedImageId === gift.order ? (
                      <p
                        key={gift.order}
                        style={{
                          color:
                            selectedImageId === gift.order
                              ? gift.borderColor
                              : "white",
                        }}
                      >
                        {gift.desc}
                      </p>
                    ) : null
                  )}
                </div>
              </div>
              <div className="writing-zone">
                {gifts.map((gift) =>
                  selectedImageId === gift.order ? (
                    <div>
                      <div className="writing-name">
                        <h2>แปะชื่อ</h2>
                        <div className="writing-name-textarea"></div>
                        <textarea
                          rows={1}
                          cols={29}
                          placeholder="Write your name here..."
                          ref={userNameRef}
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          style={{
                            borderColor:
                              selectedImageId === gift.order
                                ? gift.borderColor
                                : "black",
                          }}
                        />
                      </div>
                      <div className="writing-comment">
                        <h2>แปะคำอวยพร</h2>
                        <textarea
                          rows={3}
                          cols={29}
                          placeholder="Write your answer here..."
                          ref={userCommentRef}
                          value={userComment}
                          onChange={(e) => setUserComment(e.target.value)}
                          style={{
                            borderColor:
                              selectedImageId === gift.order
                                ? gift.borderColor
                                : "black",
                          }}
                        />
                      </div>
                      <br />
                      <button onClick={handleSubmit} className='submit-btn'>ส่งคำอวยพร</button>
                    </div>
                  ) : null
                )}
              </div>
            </div>
          </div>
        )}
        {/* message */}
        {!postError && !postIsLoading && (
          <div className="w-full container ">
            <InfiniteScroll
              dataLength={
                pageSize * page < (postData?.total as number)
                  ? pageSize * page
                  : (postData?.total as number)
              } //This is important field to render the next data
              next={async () => {
                await new Promise((r) => setTimeout(r, 1000));
                setPage(page + 1);
              }}
              hasMore={pageSize * page < (postData?.total as number)}
              loader={
                <div className="xl:col-span-3 md:col-span-2 h-fit p-8 flex justify-center">
                  <CircularProgress />
                </div>
              }
              className="w-full grid xl:grid-cols-3 md:grid-cols-2 gap-4 px-4 min-[341px]:py-4 pt-4 pb-12 items-center h-full justify-center"
            >
              {postData?.data.slice(0, pageSize * page).map((post, index) => (
                <Grow key={post.id} in timeout={1000}>
                  <div
                    className={`rounded-none justify-self-center flex-col relative overflow-hidden flex h-full w-full max-w-[425px] text-black/50`}
                  >
                    <BadgeBody
                      className="absolute top-0 left-0 w-full h-[300vh] object-fill -z-[1]"
                      style={{
                        color: post.gift?.bgColorCode
                          ? post.gift?.bgColorCode
                          : "white",
                        borderColor: post.gift.borderColor
                          ? post.gift.borderColor
                          : "black",
                      }}
                    />
                    {post.gift.name == "cocoa" && (
                      <CocoaTop
                        style={{
                          color: post.gift?.bgColorCode
                            ? post.gift?.bgColorCode
                            : "white",
                          borderColor: post.gift.borderColor
                            ? post.gift.borderColor
                            : "black",
                        }}
                        className=""
                      />
                    )}
                    {post.gift.name == "momiji" && (
                      <MomijiTop
                        style={{
                          color: post.gift?.bgColorCode
                            ? post.gift?.bgColorCode
                            : "white",
                          borderColor: post.gift.borderColor
                            ? post.gift.borderColor
                            : "black",
                        }}
                        className=""
                      />
                    )}
                    {post.gift.name == "star" && (
                      <StarTop
                        style={{
                          color: post.gift?.bgColorCode
                            ? post.gift?.bgColorCode
                            : "white",
                          borderColor: post.gift.borderColor
                            ? post.gift.borderColor
                            : "black",
                        }}
                        className=""
                      />
                    )}
                    {post.gift.name == "pork" && (
                      <PorkTop
                        style={{
                          color: post.gift?.bgColorCode
                            ? post.gift?.bgColorCode
                            : "white",
                          borderColor: post.gift.borderColor
                            ? post.gift.borderColor
                            : "black",
                        }}
                        className=""
                      />
                    )}
                    {post.gift.name == "cpu" && (
                      <CpuTop
                        style={{
                          color: post.gift?.bgColorCode
                            ? post.gift?.bgColorCode
                            : "white",
                          borderColor: post.gift.borderColor
                            ? post.gift.borderColor
                            : "black",
                        }}
                        className=""
                      />
                    )}
                    <div className="flex w-full flex-col px-4 py-2 absolute top-0 left-0">
                      <div className="flex">
                        {post.giftId && (
                          <img
                            src={post.gift?.imgURL}
                            className="card-sticker h-[80px] object-contain"
                          />
                        )}
                        <b className="card-name text-[#353935] min-[425px]:text-[20px] text-[14px] break-words overflow-hidden pt-4 min-[425px]:pr-20 min-[375px]:pr-16 pr-14">
                          {post.name}
                        </b>
                      </div>
                    </div>
                    <div className="flex flex-1 h-full flex-col relative overflow-hidden px-4 py-2">
                      <span className="card-comment text-center text-[#353935] sm:text-xl overflow-hidden justify-center items-center flex flex-1">
                        {post.comment}
                      </span>
                      <div className="card-time w-full flex pt-4 min-[425px]:px-4 px-2 min-[425px]:text-base text-sm ">
                        <span className="">
                          {DateTime.fromISO(post.createdAt)
                            .setZone("Asia/Bangkok")
                            .toFormat("dd")}{" "}
                          {DateTime.fromISO(post.createdAt)
                            .setZone("Asia/Bangkok")
                            .toFormat("LLLL")}{" "}
                          {DateTime.fromISO(post.createdAt)
                            .setZone("Asia/Bangkok")
                            .toFormat("yy")}
                        </span>
                        <span className="flex-1 text-right">
                          {DateTime.fromISO(post.createdAt)
                            .setZone("Asia/Bangkok")
                            .toFormat("HH")}
                          :
                          {DateTime.fromISO(post.createdAt)
                            .setZone("Asia/Bangkok")
                            .toFormat("mm")}
                        </span>
                      </div>
                    </div>
                    {/* Bottom */}
                    {post.gift.name == "cocoa" && (
                      <CocoaBottom
                        style={{
                          color: post.gift?.bgColorCode
                            ? post.gift?.bgColorCode
                            : "white",
                          borderColor: post.gift.borderColor
                            ? post.gift.borderColor
                            : "black",
                        }}
                      />
                    )}
                    {post.gift.name == "momiji" && (
                      <MomijiBottom
                        style={{
                          color: post.gift?.bgColorCode
                            ? post.gift?.bgColorCode
                            : "white",
                          borderColor: post.gift.borderColor
                            ? post.gift.borderColor
                            : "black",
                        }}
                      />
                    )}
                    {post.gift.name == "star" && (
                      <StarBottom
                        style={{
                          color: post.gift?.bgColorCode
                            ? post.gift?.bgColorCode
                            : "white",
                          borderColor: post.gift.borderColor
                            ? post.gift.borderColor
                            : "black",
                        }}
                      />
                    )}
                    {post.gift.name == "pork" && (
                      <PorkBottom
                        style={{
                          color: post.gift?.bgColorCode
                            ? post.gift?.bgColorCode
                            : "white",
                          borderColor: post.gift.borderColor
                            ? post.gift.borderColor
                            : "black",
                        }}
                      />
                    )}
                    {post.gift.name == "cpu" && (
                      <CpuBottom
                        style={{
                          color: post.gift?.bgColorCode
                            ? post.gift?.bgColorCode
                            : "white",
                          borderColor: post.gift.borderColor
                            ? post.gift.borderColor
                            : "black",
                        }}
                      />
                    )}
                    {/* Count */}
                    <div
                      className="
                      card-count-group
                      absolute
                      min-[425px]:bottom-0
                      -bottom-4
                      min-[425px]:right-14
                      right-10
                      -rotate-12
                      translate-x-[50%]
                      z-[1]
                      min-[425px]:scale-100
                      scale-[70%]  
                    "
                    >
                      {post.gift.name == "star" && (
                        <img
                          className="w-26 card-image-count-yellow"
                          src="/img/Bottom number/yellow.png"
                        />
                      )}
                      {post.gift.name == "cocoa" && (
                        <img
                          className="w-24 card-image-count-red"
                          src="/img/Bottom number/Red.png"
                        />
                      )}
                      {post.gift.name == "momiji" && (
                        <img
                          className="w-26 card-image-count-brown"
                          src="/img/Bottom number/brown.png"
                        />
                      )}
                      {post.gift.name == "pork" && (
                        <img
                          className="w-26 card-image-count-green"
                          src="/img/Bottom number/Green.png"
                        />
                      )}
                      {post.gift.name == "cpu" && (
                        <img
                          className="w-24 card-image-count-blue"
                          src="/img/Bottom number/blue.png"
                        />
                      )}
                      <div className="card-count text-[#353935] absolute left-[36px] top-12 text-xl font-bold">
                        {postData.total - index}
                      </div>
                    </div>
                  </div>
                </Grow>
              ))}
            </InfiniteScroll>
          </div>
        )}
        {postIsLoading && (
          <div className="w-full h-fit p-8 flex justify-center">
            <CircularProgress className="" />
          </div>
        )}
        {postError && (!postIsLoading || !postIsValidating) && (
          <div className="w-full h-fit p-8 flex flex-col items-center gap-2">
            เกิดความผิดพลาดในระบบ กรุณาลองใหม่
            <Button
              onClick={() => postMutate()}
              variant="outlined"
              className={`w-fit text-[22px] bg-[#E4CFFF] text-[#4E4670] rounded-[55px] ${alegreya.className} normal-case px-[22px] py-[12px] min-h-0 leading-none border-2 border-[#4E4670]`}
            >
              retry <RefreshIcon />
            </Button>
          </div>
        )}
      </div>
      <div className="w-full h-fit flex flex-row gap-2 fixed bottom-0 bg-[#B44137] z-[1] p-2 text-white justify-center items-center">
        {/* <Link className="flex min-[431px]:flex-row flex-col items-center gap-1" href={"https://twitter.com/Dreamerism89"} target="_blank">
            <TwitterIcon className="text-2xl"/>
            <span className="min-[431px]:text-xl text-xs text-center">ผู้ฝันใฝ่แปลว่าอิสระ</span>
        </Link>
        <Divider className="bg-white" orientation="vertical" flexItem /> */}
        <div className="h-full justify-center items-center flex sm:flex-row flex-col min-[341px]:flex-none flex-1 sm:gap-2">
          <span className="sm:text-base text-xs text-center">
            ติดตาม{" "}
            <b className="underline">
              เฮียวกะอัลฟ่าสิบห้าเอนจิ้นโปรแม็กซ์วีอาร์พลัสบวกบวก
            </b>{" "}
            ได้แล้ววันนี้ที่
          </span>
          <div className="min-[341px]:flex grid grid-cols-3 min-[341px]:gap-2">
            <Link
              className="flex items-center shrink-0"
              href={"https://algorhythm.realic.net/links/v-agent/hyougaalpha"}
              target="_blank"
            >
              <img src="/img/logo_arp.png" className="w-[36px]" />
            </Link>
            <Link
              className="flex items-center"
              href={"https://www.youtube.com/@HyougaAlpha_ARP"}
              target="_blank"
            >
              <YouTubeIcon className="text-3xl" />
            </Link>
            <Link
              className="flex items-center"
              href={"https://www.facebook.com/HyougaAlpha/"}
              target="_blank"
            >
              <FontAwesomeIcon
                className="text-[24px] aspect-square"
                icon={faFacebook}
              />
            </Link>
            <Link
              className="flex items-center"
              href={"https://www.instagram.com/hyougaalpha_arp/"}
              target="_blank"
            >
              <FontAwesomeIcon
                className="text-[24px] aspect-square"
                icon={faInstagram}
              />
            </Link>
            <Link
              className="flex items-center"
              href={"https://twitter.com/HyougaAlpha_ARP"}
              target="_blank"
            >
              <TwitterIcon className="text-3xl" />
            </Link>
            <Link
              className="flex items-center p-1"
              href={"https://bsky.app/profile/hyougaalpha.bsky.social"}
              target="_blank"
            >
              <FontAwesomeIcon
                className="text-[24px] aspect-square"
                icon={faBluesky}
              />
            </Link>
            <Link
              className="flex items-center"
              href={"https://www.twitch.tv/hyougaalpha"}
              target="_blank"
            >
              <FontAwesomeIcon
                className="text-[24px] aspect-square"
                icon={faTwitch}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
