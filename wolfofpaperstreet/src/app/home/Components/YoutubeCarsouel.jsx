"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";

const videos = [
  "https://www.youtube.com/embed/35MBnbmGi18", // Top 5 Stocks for February 2025
 "https://www.youtube.com/embed/WY2-Sn4L-XU", // How to Invest for Beginners
  "https://www.youtube.com/embed/YmOBZJFWVwQ" ,// Stock Market for Beginners (Explained)
  "https://www.youtube.com/embed/ooWTlLXMDqQ  ", // How to Trade Stocks Like a Pro
  "https://www.youtube.com/embed/4kYLWwFARsY", // Technical Analysis for Trading
];

export default function YouTubeCarousel() {
  return (
    <div className="max-w-5xl mx-auto p-4">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        className="rounded-lg overflow-hidden shadow-lg"
      >
        {videos.map((video, index) => (
          <SwiperSlide key={index} className="flex justify-center items-center">
            <div className="relative w-full md:w-3/4 aspect-video">
              <iframe
                className="w-full h-full border-none rounded-lg"
                src={video}
                title={`Stock Trading Video ${index + 1}`}
                allowFullScreen
              ></iframe>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
