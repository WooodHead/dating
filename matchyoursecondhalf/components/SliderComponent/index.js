import Slider from "react-slick";
import IconArrowCarousel from "components/icons/IconArrowCarousel";
import styles from "./index.module.scss";

function SliderComponent(
  {
    extraSettings,
    children
  }
) {
  const PrevArrow = ({ onClick }) => (
    <IconArrowCarousel
      className={styles['prev-arrow']}
      onClick={onClick}
    />
  );

  const NextArrow = ({ onClick }) => (
    <IconArrowCarousel
      className={styles['next-arrow']}
      onClick={onClick}
    />
  );

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    prevArrow: <PrevArrow/>,
    nextArrow: <NextArrow/>,
    className: styles.wrap,
    ...extraSettings
  };

  return (
    <Slider {...settings}>
      {children}
    </Slider>
  );
}

export default SliderComponent;
