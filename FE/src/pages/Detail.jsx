"use client";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API } from "../lib/api";

import React from "react";
import {
  Avatar,
  chakra,
  Icon,
  SimpleGrid,
  Box,
  IconButton,
  useBreakpointValue,
  Stack,
  Heading,
  Text,
  Container,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import { StarIcon } from "@chakra-ui/icons";
import Slider from "react-slick";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import SmallWithLogoLeft from "../../layouts/Footer";

export function Detail() {
  const { id } = useParams();
  const [data, setData] = useState();
  const [dataReviews, setDataReviews] = useState([]);
  console.log("ini data", data);
  const [location, setLocation] = useState(null);
  const center = location
    ? { lat: location.lat, lng: location.lng, name: location.name }
    : { lat: -3.745, lng: -38.523 };
  const container = {
    width: "400px",
    height: "400px",
  };

  const [maps, setMap] = useState(null);

  const onLoad = React.useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    libraries: ["places"],
  });

  async function getDetailData() {
    const response = await API.get(`/${id}`);
    setData(response.data);
    if (response.data.coordinates.latitude) {
      setLocation({
        lat: response.data.coordinates.latitude,
        lng: response.data.coordinates.longitude,
        name: response.data.name,
      });
    }
  }
  async function getReviews() {
    const response = await API.get(`/${id}/reviews`);
    setDataReviews(response.data.reviews);
  }

  const backgrounds = [
    `url("data:image/svg+xml, %3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'560\' height=\'185\' viewBox=\'0 0 560 185\' fill=\'none\'%3E%3Cellipse cx=\'102.633\' cy=\'61.0737\' rx=\'102.633\' ry=\'61.0737\' fill=\'%23ED64A6\' /%3E%3Cellipse cx=\'399.573\' cy=\'123.926\' rx=\'102.633\' ry=\'61.0737\' fill=\'%23F56565\' /%3E%3Cellipse cx=\'366.192\' cy=\'73.2292\' rx=\'193.808\' ry=\'73.2292\' fill=\'%2338B2AC\' /%3E%3Cellipse cx=\'222.705\' cy=\'110.585\' rx=\'193.808\' ry=\'73.2292\' fill=\'%23ED8936\' /%3E%3C/svg%3E")`,
    `url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' width='560' height='185' viewBox='0 0 560 185' fill='none'%3E%3Cellipse cx='457.367' cy='123.926' rx='102.633' ry='61.0737' transform='rotate(-180 457.367 123.926)' fill='%23ED8936'/%3E%3Cellipse cx='160.427' cy='61.0737' rx='102.633' ry='61.0737' transform='rotate(-180 160.427 61.0737)' fill='%2348BB78'/%3E%3Cellipse cx='193.808' cy='111.771' rx='193.808' ry='73.2292' transform='rotate(-180 193.808 111.771)' fill='%230BC5EA'/%3E%3Cellipse cx='337.295' cy='74.415' rx='193.808' ry='73.2292' transform='rotate(-180 337.295 74.415)' fill='%23ED64A6'/%3E%3C/svg%3E")`,
    `url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' width='560' height='185' viewBox='0 0 560 185' fill='none'%3E%3Cellipse cx='102.633' cy='61.0737' rx='102.633' ry='61.0737' fill='%23ED8936'/%3E%3Cellipse cx='399.573' cy='123.926' rx='102.633' ry='61.0737' fill='%2348BB78'/%3E%3Cellipse cx='366.192' cy='73.2292' rx='193.808' ry='73.2292' fill='%230BC5EA'/%3E%3Cellipse cx='222.705' cy='110.585' rx='193.808' ry='73.2292' fill='%23ED64A6'/%3E%3C/svg%3E")`,
    `url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' width='560' height='185' viewBox='0 0 560 185' fill='none'%3E%3Cellipse cx='457.367' cy='123.926' rx='102.633' ry='61.0737' transform='rotate(-180 457.367 123.926)' fill='%23ECC94B'/%3E%3Cellipse cx='160.427' cy='61.0737' rx='102.633' ry='61.0737' transform='rotate(-180 160.427 61.0737)' fill='%239F7AEA'/%3E%3Cellipse cx='193.808' cy='111.771' rx='193.808' ry='73.2292' transform='rotate(-180 193.808 111.771)' fill='%234299E1'/%3E%3Cellipse cx='337.295' cy='74.415' rx='193.808' ry='73.2292' transform='rotate(-180 337.295 74.415)' fill='%2348BB78'/%3E%3C/svg%3E")`,
  ];

  const settings = {
    dots: true,
    arrows: false,
    fade: true,
    infinite: true,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const photosUrl = data?.photos;

  const [slider, setSlider] = useState(0);

  const top = useBreakpointValue({ base: "90%", md: "50%" });
  const side = useBreakpointValue({ base: "30%", md: "40px" });

  const hoursData = data?.hours[0]?.open;

  // Fungsi untuk mengonversi waktu dari format "1100" ke "10:00 AM"
  function formatTime(time) {
    if (typeof time === "string" && time.length >= 4) {
      const hours = time.substring(0, 2);
      const minutes = time.substring(2);
      const formattedTime = `${hours}:${minutes}`;
      const date = new Date("2000-01-01T" + formattedTime + ":00");
      return date.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    } else {
      return "Closed";
    }
  }

  // Mengelompokkan waktu berdasarkan hari
  const days = [
    "Sunday   ",
    "Monday   ",
    "Tuesday  ",
    "Wednesday",
    "Thursday ",
    "Friday   ",
    "Saturday ",
  ];
  const openingHours = {};
  hoursData?.forEach((hour) => {
    const day = days[hour.day];
    if (!openingHours[day]) {
      openingHours[day] = [];
    }
    openingHours[day].push(
      formatTime(hour.start) + " - " + formatTime(hour.end)
    );
  });

  const today = new Date().getDay();
  const todayHours = hoursData?.find((hour) => hour.day === today);
  const openingTime = formatTime(todayHours?.start);
  const closingTime = formatTime(todayHours?.end);

  useEffect(() => {
    getDetailData();
    getReviews();
  }, []);

  return (
    <Box display={"flex"} flexDir={"column"} alignItems={"center"}>
      <Heading my={5}>{data?.name}</Heading>
      <Box
        margin={"auto"}
        position={"relative"}
        height={"60vh"}
        boxShadow={"rgba(0, 0, 0, 0.35) 0px 5px 15px;"}
        width={"full"}
        overflow={"hidden"}
      >
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
        />
        <IconButton
          aria-label="left-arrow"
          position="absolute"
          left={side}
          top={top}
          transform={"translate(0%, -50%)"}
          zIndex={2}
          onClick={() => slider?.slickPrev()}
        >
          <BiLeftArrowAlt size="40px" />
        </IconButton>
        <IconButton
          aria-label="right-arrow"
          position="absolute"
          right={side}
          top={top}
          transform={"translate(0%, -50%)"}
          zIndex={2}
          onClick={() => slider?.slickNext()}
        >
          <BiRightArrowAlt size="40px" />
        </IconButton>
        <Slider {...settings} ref={(slider) => setSlider(slider)}>
          {photosUrl?.map((card, index) => (
            <Box
              key={index}
              height={"600px"}
              position="relative"
              backgroundPosition="center"
              backgroundRepeat="no-repeat"
              backgroundSize="cover"
              backgroundImage={photosUrl[index]}
              backdropBrightness={"80%"}
            >
              <Container size="container.lg" height="600px" position="relative">
                <Stack
                  maxW={"lg"}
                  position="absolute"
                  top="50%"
                  left="-50%"
                  transform="translate(0, -50%)"
                >
                  <Heading
                    fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                    color={"white"}
                  >
                    {data.location.display_address[1]}
                  </Heading>
                  <Text
                    fontSize={{ base: "md", lg: "lg" }}
                    fontWeight={400}
                    borderRadius={"5px"}
                    color={"#fd8f44"}
                    display={"flex"}
                    alignItems={"center"}
                  >
                    {Array.from({ length: data.rating }).map((_, index) => (
                      <StarIcon
                        color={"white"}
                        bg={"yellow.500"}
                        p={1}
                        w={7}
                        h={7}
                        mx={1}
                        borderRadius={"full"}
                        key={index}
                      />
                    ))}
                    <Text color={"white"}>
                      {data.rating} ({data.review_count}) reviews
                    </Text>
                  </Text>
                  <Flex flexDir={"row"}>
                    {todayHours ? (
                      <Text
                        color={"rgba(4,197,133,1)"}
                        fontWeight={"bold"}
                        fontSize={"lg"}
                      >
                        {data.is_closed ? (
                          <Text color={"red.500"}>Closed</Text>
                        ) : (
                          <Text color={"green.500"}>Open</Text>
                        )}
                        <Text color={"white"}>
                          {" "}
                          {openingTime} - {closingTime}{" "}
                        </Text>
                      </Text>
                    ) : (
                      <Text>Closed</Text>
                    )}
                  </Flex>
                </Stack>
              </Container>
            </Box>
          ))}
        </Slider>
      </Box>

      <Flex
        textAlign={"center"}
        pt={4}
        justifyContent={"center"}
        direction={"column"}
        width={"full"}
        overflow={"hidden"}
      >
        <Box width={{ base: "full", sm: "lg", lg: "xl" }} margin={"auto"}>
          <chakra.h3
            fontFamily={"Work Sans"}
            fontWeight={"bold"}
            fontSize={20}
            textTransform={"uppercase"}
            color={"purple.400"}
          >
            People love us
          </chakra.h3>
          <chakra.h1
            py={5}
            fontSize={48}
            fontFamily={"Work Sans"}
            fontWeight={"bold"}
            color={useColorModeValue("gray.700", "gray.50")}
          >
            You&apos;re in good Businesses
          </chakra.h1>
          <chakra.h2
            margin={"auto"}
            width={"70%"}
            fontFamily={"Inter"}
            fontWeight={"medium"}
            color={useColorModeValue("gray.500", "gray.400")}
          >
            See why over{" "}
            <chakra.strong color={useColorModeValue("gray.700", "gray.50")}>
              150,000+
            </chakra.strong>{" "}
            influencers use YELP to manage their Businesses!
          </chakra.h2>
        </Box>
        <SimpleGrid
          columns={{ base: 1, xl: 2 }}
          spacing={"20"}
          mt={16}
          mb={16}
          mx={"auto"}
        >
          {dataReviews.map((cardInfo, index) => (
            <Flex
              boxShadow={"lg"}
              maxW={"640px"}
              direction={{ base: "column-reverse", md: "row" }}
              width={"full"}
              rounded={"xl"}
              p={10}
              justifyContent={"space-between"}
              position={"relative"}
              bg={useColorModeValue("white", "gray.800")}
              _after={{
                content: '""',
                position: "absolute",
                height: "21px",
                width: "29px",
                left: "35px",
                top: "-10px",
                backgroundSize: "cover",
                backgroundImage: `url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' width='29' height='21' viewBox='0 0 29 21' fill='none'%3E%3Cpath d='M6.91391 21C4.56659 21 2.81678 20.2152 1.66446 18.6455C0.55482 17.0758 0 15.2515 0 13.1727C0 11.2636 0.405445 9.43939 1.21634 7.7C2.0699 5.91818 3.15821 4.3697 4.48124 3.05454C5.84695 1.69697 7.31935 0.678787 8.89845 0L13.3157 3.24545C11.5659 3.96667 9.98676 4.94242 8.57837 6.17273C7.21266 7.36061 6.25239 8.63333 5.69757 9.99091L6.01766 10.1818C6.27373 10.0121 6.55114 9.88485 6.84989 9.8C7.19132 9.71515 7.63944 9.67273 8.19426 9.67273C9.34658 9.67273 10.4776 10.097 11.5872 10.9455C12.7395 11.7939 13.3157 13.1091 13.3157 14.8909C13.3157 16.8848 12.6542 18.4121 11.3311 19.4727C10.0508 20.4909 8.57837 21 6.91391 21ZM22.5982 21C20.2509 21 18.5011 20.2152 17.3488 18.6455C16.2391 17.0758 15.6843 15.2515 15.6843 13.1727C15.6843 11.2636 16.0898 9.43939 16.9007 7.7C17.7542 5.91818 18.8425 4.3697 20.1656 3.05454C21.5313 1.69697 23.0037 0.678787 24.5828 0L29 3.24545C27.2502 3.96667 25.6711 4.94242 24.2627 6.17273C22.897 7.36061 21.9367 8.63333 21.3819 9.99091L21.702 10.1818C21.9581 10.0121 22.2355 9.88485 22.5342 9.8C22.8756 9.71515 23.3238 9.67273 23.8786 9.67273C25.0309 9.67273 26.1619 10.097 27.2715 10.9455C28.4238 11.7939 29 13.1091 29 14.8909C29 16.8848 28.3385 18.4121 27.0155 19.4727C25.7351 20.4909 24.2627 21 22.5982 21Z' fill='%239F7AEA'/%3E%3C/svg%3E")`,
              }}
              _before={{
                content: '""',
                position: "absolute",
                zIndex: "-1",
                height: "full",
                maxW: "640px",
                width: "full",
                filter: "blur(40px)",
                transform: "scale(0.98)",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                top: 0,
                left: 0,
                backgroundImage: backgrounds[index % 4],
              }}
            >
              <Flex
                direction={"column"}
                textAlign={"left"}
                justifyContent={"space-between"}
              >
                <chakra.p
                  fontFamily={"Inter"}
                  fontWeight={"medium"}
                  fontSize={"15px"}
                  pb={4}
                >
                  {cardInfo.text}
                </chakra.p>
                <chakra.p
                  fontFamily={"Work Sans"}
                  fontWeight={"bold"}
                  fontSize={14}
                >
                  {cardInfo.user.name}
                  <chakra.span
                    fontFamily={"Inter"}
                    fontWeight={"medium"}
                    color={"yellow.500"}
                  >
                    {Array.from({ length: cardInfo.rating }).map((_, index) => (
                      <StarIcon mx={1} mb={1.5} key={index} />
                    ))}
                  </chakra.span>
                </chakra.p>
              </Flex>
              <Flex flexDirection={"column"}>
                <Avatar
                  src={cardInfo?.user.image_url}
                  height={"80px"}
                  width={"80px"}
                  alignSelf={"center"}
                  m={{ base: "0 0 35px 0", md: "0 0 0 50px" }}
                />
              </Flex>
            </Flex>
          ))}
        </SimpleGrid>
        {/* <Box display={"flex"}> */}
        <Box
          m={"auto"}
          display={"flex"}
          flexDir={{ md: "column", lg: "row" }}
          alignItems={"center"}
          gap={10}
        >
          <Box>
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={container}
                center={center}
                zoom={13}
                onLoad={onLoad}
                onUnmount={onUnmount}
              ></GoogleMap>
            ) : (
              <Text>Not yet </Text>
            )}
          </Box>
          <Box fontSize={"1.5em"} textAlign={"center"} lineHeight={"2em"}>
            <Heading color={"blackAlpha.700"}>Opening Hours</Heading>
            <Box display="flex" flexDirection="column">
              {Object.keys(openingHours).map((day) => (
                <Box display="flex" justifyContent="space-between" key={day}>
                  <Text>{day}:</Text>
                  <Text>{openingHours[day].join(", ")}</Text>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
        <Box>
          <Icon viewBox="0 0 40 35" mt={14} boxSize={10} color={"purple.400"}>
            <path
              fill={"currentColor"}
              d="M10.7964 5.04553e-07C8.66112 -0.000123335 6.57374 0.632971 4.79827 1.81922C3.0228 3.00547 1.63898 4.69158 0.82182 6.66433C0.00466116 8.63708 -0.209132 10.8079 0.207477 12.9021C0.624087 14.9964 1.65239 16.9201 3.16233 18.4299L19.1153 34.3828C19.2395 34.5074 19.3871 34.6062 19.5496 34.6736C19.7121 34.741 19.8863 34.7757 20.0622 34.7757C20.2381 34.7757 20.4123 34.741 20.5748 34.6736C20.7373 34.6062 20.8848 34.5074 21.0091 34.3828L36.962 18.4272C38.9319 16.3917 40.0228 13.6636 39.9996 10.8311C39.9764 7.99858 38.8409 5.28867 36.838 3.28573C34.835 1.28279 32.1251 0.147283 29.2926 0.124081C26.4601 0.100879 23.732 1.19184 21.6965 3.1617L20.0622 4.79337L18.4305 3.1617C17.4276 2.15892 16.237 1.36356 14.9267 0.821064C13.6163 0.278568 12.2119 -0.000433066 10.7937 5.04553e-07H10.7964Z"
            />
          </Icon>
        </Box>
        <SmallWithLogoLeft />
      </Flex>
    </Box>
  );
}
