import { ChevronDownIcon, Search2Icon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Slide,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { API } from "../lib/api";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import "../index.css";
import { Link } from "react-router-dom";
import SmallWithLogoLeft from "../../layouts/Footer";

export default function Home() {
  const [searchLocation, setSearchLocation] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [businesses, setBusinesses] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const { isOpen, onToggle } = useDisclosure();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const availableCategories = [
    { id: "seafood", name: "Seafood" },
    { id: "steak", name: "Steak" },
    { id: "wine_bars", name: "Wine Bars" },
  ];

  const [slider, setSlider] = useState(0);

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

  function handleCategoryChange(categoryId, checked) {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId]);
    } else {
      setSelectedCategories(
        selectedCategories.filter((id) => id !== categoryId)
      );
    }
    handleSearch();
  }

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;

  const handlePageChange = (selectPage) => {
    setCurrentPage(selectPage.selected);
  };

  const indexOfLastPage = (currentPage + 1) * itemsPerPage;
  const indexOfFirstPage = indexOfLastPage - itemsPerPage;
  const currentBussinesses = businesses.slice(
    indexOfFirstPage,
    indexOfLastPage
  );
  console.log("ini curren", currentBussinesses);

  async function getBusinesses() {
    try {
      const response = await API.get("?location=usa");
      setBusinesses(response.data.businesses);
    } catch (err) {
      console.log("error", err);
    }
  }

  async function handleSearch() {
    const queryParams = [];
    if (searchLocation) {
      queryParams.push("?location=" + searchLocation);
    }
    if (searchTerm) {
      queryParams.push("term=" + searchTerm);
    }
    if (selectedCategories.length > 0) {
      const selectedCategoriesString = selectedCategories
        .map((category) => encodeURIComponent(category))
        .join("%2C%20");
      queryParams.push("categories=" + selectedCategoriesString);
    }

    const queryString = queryParams.join("&");
    try {
      const response = await API.get(queryString);
      setBusinesses(response.data.businesses);
    } catch (err) {
      console.log("error", err);
    }
  }

  useEffect(() => {
    getBusinesses();
  }, []);

  return (
    <>
      <Flex minHeight={"100vh"} flexDirection={"column"} gap={5}>
        <Box
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          gap={5}
          flex={1}
        >
          <Box mt={10} width={"60%"}>
            <Flex>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Search2Icon color="gray.300" />
                </InputLeftElement>
                <Input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="Search by location..."
                />
              </InputGroup>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Search2Icon color="gray.300" />
                </InputLeftElement>
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search term, e.g. food or restaurants."
                />
              </InputGroup>

              <InputGroup>
                <Menu closeOnSelect={false}>
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    variant="outline"
                    width={"full"}
                  >
                    <Text
                      fontWeight={"normal"}
                      textAlign={"left"}
                      color={"gray.500"}
                      isTruncated
                    >
                      Categories
                    </Text>
                  </MenuButton>
                  <MenuList minWidth="190px" maxW="190px">
                    {availableCategories.map((category) => (
                      <MenuItem
                        whiteSpace="nowrap"
                        overflow="hidden"
                        textOverflow="ellipsis"
                      >
                        <Checkbox
                          key={category.id}
                          isChecked={selectedCategories.includes(category.id)}
                          onChange={(e) =>
                            handleCategoryChange(category.id, e.target.checked)
                          }
                        >
                          {category.name}
                        </Checkbox>
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
                <Button
                  color={"white"}
                  type="submit"
                  bgColor={"teal"}
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </InputGroup>
            </Flex>
          </Box>

          <Flex
            flexDirection={"row"}
            flexWrap={"wrap"}
            justifyContent={"center"}
            gap={5}
          >
            {currentBussinesses.map((business) => (
              <Box
                border={"1px"}
                borderRadius={"lg"}
                boxShadow={"lg"}
                key={business.id}
                p={5}
                mt={5}
              >
                <Box width={300}>
                  <Link to={`/detail/${business.id}`}>
                    <Heading
                      size={"md"}
                      display={"flex"}
                      flexDirection={"space-between"}
                    >
                      {business.name}
                    </Heading>
                    {business.is_closed ? (
                      <Text color={"red.500"}>Closed</Text>
                    ) : (
                      <Text color={"green.500"}>Open</Text>
                    )}
                  </Link>
                  <Image
                    src={business.image_url}
                    width={"20em"}
                    height={"20em"}
                  />

                  <Text
                    overflow={"hidden"}
                    textOverflow={"ellipsis"}
                    whiteSpace={"nowrap"}
                  >
                    {business.location.display_address}
                  </Text>
                </Box>
              </Box>
            ))}
          </Flex>
          {businesses.length > 0 && (
            <Flex justifyContent={"center"}>
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                breakLabel="..."
                pageCount={Math.ceil(businesses.length / itemsPerPage)}
                marginPagesDisplayed={1}
                pageRangeDisplayed={5}
                onPageChange={handlePageChange}
                containerClassName={"pagination"}
                subContainerClassName={"pages pagination"}
                activeClassName={"active"}
                pageClassName={"page-item"}
              />
            </Flex>
          )}
        </Box>

        <Box as="footer">
          <SmallWithLogoLeft />
        </Box>
      </Flex>
    </>
  );
}
