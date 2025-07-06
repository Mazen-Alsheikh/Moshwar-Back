import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const MapUpdater = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 15);
    }
  }, [position]);
  return null;
};

const LocationPicker = ({ setPosition, setPlaceName }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition({ lat, lng });

      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.display_name) {
            setPlaceName(data.display_name);
          }
        })
        .catch((err) => console.error(err));
    },
  });
  return null;
};

const Travel = () => {
  const [vhicle, setVhicle] = useState("عربية");
  const [placeName, setPlaceName] = useState("");
  const [position, setPosition] = useState(null); // الوجهة
  const [currentLocation, setCurrentLocation] = useState(null); // موقعي الحالي
  const [routeCoords, setRouteCoords] = useState([]);

  // جلب موقعي الحالي عند تحميل الصفحة
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
      },
      (err) => {
        console.error("فشل في تحديد الموقع:", err);
      }
    );
  }, []);

  // عند كتابة اسم المكان → نحوله إلى إحداثيات
  useEffect(() => {
    if (!placeName) return;

    const delayDebounce = setTimeout(() => {
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${placeName}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.length > 0) {
            setPosition({
              lat: parseFloat(data[0].lat),
              lng: parseFloat(data[0].lon),
            });
          }
        })
        .catch((err) => console.error(err));
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [placeName]);

  // رسم المسار بين موقعي والوجهة
  useEffect(() => {
    if (!currentLocation || !position) return;

    const { lat: startLat, lng: startLng } = currentLocation;
    const { lat: endLat, lng: endLng } = position;

    fetch(
      `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`
    )
      .then((res) => res.json())
      .then((data) => {
        const coords = data.routes[0].geometry.coordinates.map((coord) => [
          coord[1],
          coord[0],
        ]);
        setRouteCoords(coords);
      })
      .catch((err) => console.error(err));
  }, [currentLocation, position]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!placeName || !position || !currentLocation) {
      alert("يرجى كتابة أو تحديد الوجهة وانتظار الموقع الحالي");
      return;
    }

    fetch("http://localhost:5000/travel/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vhicle,
        from: {
          lat: currentLocation.lat,
          lng: currentLocation.lng,
        },
        to: {
          name: placeName,
          lat: position.lat,
          lng: position.lng,
        },
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("تم إرسال الطلب:", result);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="text-center mt-5">
      <h4 className="mb-3">اختر وسيلة المشوار وحدد المكان</h4>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Select onChange={(e) => setVhicle(e.target.value)}>
            <option>عربية</option>
            <option>ركشة</option>
            <option>موتر</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="اكتب المكان (مثال: السوق المركزي)"
            value={placeName}
            onChange={(e) => setPlaceName(e.target.value)}
          />
        </Form.Group>

        <div style={{ height: "400px", width: "100%", marginBottom: "20px" }}>
          <MapContainer
            center={currentLocation || [15.5, 32.5]}
            zoom={13}
            style={{ height: "100%" }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <LocationPicker
              setPosition={setPosition}
              setPlaceName={setPlaceName}
            />
            {position && <Marker position={position} icon={markerIcon} />}
            {currentLocation && (
              <Marker position={currentLocation} icon={markerIcon} />
            )}
            {routeCoords.length > 0 && (
              <Polyline positions={routeCoords} color="blue" />
            )}
            <MapUpdater position={position || currentLocation} />
          </MapContainer>
        </div>

        <Button variant="primary" type="submit">
          طلب
        </Button>
      </Form>
    </div>
  );
};

export default Travel;
