import { Box } from "@chakra-ui/react";

export default function useMaps() {
  useEffect(() => {
    const mapOptions = {
      center: {
        lat: location.coordinates.latitude,
        lng: location.coordinates.longitude,
      },
      zoom: 15, // Sesuaikan dengan level zoom yang diinginkan
    };

    const map = new window.google.maps.Map(
      document.getElementById("map"),
      mapOptions
    );

    // Tambahkan marker ke peta
    new window.google.maps.Marker({
      position: mapOptions.center,
      map,
      title: location.name,
    });
  }, [location]);
  return <Box id="map" width={"100%"} height={"400px"} />;
}
