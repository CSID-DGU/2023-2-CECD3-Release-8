import React from "react";
import image1 from "../asset/장구명칭.png";
import image2 from "../asset/채잡는법.png";
import image3 from "../asset/장구소리.png";
import Slider from "react-slick";
import { IoIosClose, IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

function Guide({ setIsOpen }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <IoIosArrowForward size={30} color={"black"} />,
    prevArrow: <IoIosArrowBack size={30} color={"black"} />,
  };
  return (
    <div className="div-modal-background">
      <div className="div-guide-section">
        <IoIosClose
          size={30}
          className="button-guide-close"
          onClick={() => setIsOpen(false)}
        />
        <Slider {...settings} style={{ width: "90%" }}>
          <div>
            <img src={image1} className="img-guide" alt="" />
          </div>
          <div>
            <img src={image2} className="img-guide" alt="" />
          </div>
          <div>
            <img src={image3} className="img-guide" alt="" />
          </div>
        </Slider>
      </div>
    </div>
  );
}

export default Guide;
