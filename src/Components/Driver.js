import { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// أيقونة الماركر
const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const Driver = () => {
const [requests, setRequests] = useState([]);
const [selectedRequest, setSelectedRequest] = useState(null);
const [driverLocation, setDriverLocation] = useState(null);
const [pickupRoute, setPickupRoute] = useState(null); // من السائق للراكب
const [tripRoute, setTripRoute] = useState(null);     // من الراكب للوجهة


useEffect(() => {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      setDriverLocation({ lat: latitude, lng: longitude });
    },
    (err) => {
      console.error("خطأ في تحديد موقع السائق", err);
    }
  );
}, []);

const getRoute = (from, to, setRouteState) => {
  fetch(
    `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.routes && data.routes.length > 0) {
        const coords = data.routes[0].geometry.coordinates.map((c) => [
          c[1],
          c[0],
        ]);
        const distanceKm = (data.routes[0].distance / 1000).toFixed(2);
        const durationMin = (data.routes[0].duration / 60).toFixed(1);

        setRouteState({
          coords,
          distance: distanceKm,
          duration: durationMin,
        });
      }
    })
    .catch((err) => console.error("OSRM Error:", err));
};


const handleShowMap = (req) => {
  setSelectedRequest(req);

  const rider = {
    lat: req.from_lat,
    lng: req.from_lng,
  };
  const dest = {
    lat: req.to_lat,
    lng: req.to_lng,
  };

  if (driverLocation) {
    getRoute(driverLocation, rider, setPickupRoute);
  }

  getRoute(rider, dest, setTripRoute);
};


const handelAcceptRequest = (id) => {

    fetch(`http://localhost:5000/requests/${id}/accept`, {
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
        },
    })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message || "تم قبول الرحلة");

      setRequests(prev => prev.filter(req => req.id !== id));
      setSelectedRequest(null);
      setPickupRoute(null);
      setTripRoute(null);
    })
    .catch(err => {
        console.error(err);
    });
};

  useEffect(() => {
    fetch("http://localhost:5000/requests")
      .then((res) => res.json())
      .then((result) => {
        setRequests(result.data);
      })
      .catch((err) => console.error(err.message));
  }, []);

  return (
    <>
      <h4 className="mb-3">طلبات المشاوير</h4>

      {requests.map((req) => (
        <Card key={req.id} className="mb-3">
          <Card.Body>
            <Card.Title>{req.to_name}</Card.Title>
            <p>نوع الوسيلة: {req.vhicle}</p>
            <Button
              variant="info"
              className="ms-2"
              onClick={() => handleShowMap(req)}
            >
              عرض الخريطة
            </Button>
            <Button 
                variant="success"
                onClick={() => handelAcceptRequest(req.id)}>أقبل الرحلة</Button>
          </Card.Body>
        </Card>
      ))}

    {selectedRequest && driverLocation && (
    <div style={{ height: "400px", width: "100%", marginTop: "20px" }}>
        <h5 className="text-center">خريطة الطلب #{selectedRequest.id}</h5>

        <MapContainer
        center={[selectedRequest.from_lat, selectedRequest.from_lng]}
        zoom={13}
        style={{ height: "100%" }}
        >
        <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* ماركر السائق */}
        <Marker position={[driverLocation.lat, driverLocation.lng]} icon={markerIcon}>
            <Popup>السائق</Popup>
        </Marker>

        {/* ماركر الراكب */}
        <Marker position={[selectedRequest.from_lat, selectedRequest.from_lng]} icon={markerIcon}>
            <Popup>موقع الراكب</Popup>
        </Marker>

        {/* ماركر الوجهة */}
        <Marker position={[selectedRequest.to_lat, selectedRequest.to_lng]} icon={markerIcon}>
            <Popup>الوجهة</Popup>
        </Marker>

        {/* مسار من السائق للراكب */}
        {pickupRoute && (
            <Polyline positions={pickupRoute.coords} color="green" />
        )}

        {/* مسار من الراكب للوجهة */}
        {tripRoute && (
            <Polyline positions={tripRoute.coords} color="blue" />
        )}
        </MapContainer>

        {/* المسافات */}
        <div className="text-center mt-2">
        {pickupRoute && (
            <p>🚕 من السائق إلى الراكب: {pickupRoute.distance} كم / {pickupRoute.duration} دقيقة</p>
        )}
        {tripRoute && (
            <p>📍 من الراكب إلى الوجهة: {tripRoute.distance} كم / {tripRoute.duration} دقيقة</p>
        )}
        </div>
    </div>
    )}
    </>
  );
};

export default Driver;
