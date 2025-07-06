import "bootstrap/dist/css/bootstrap.min.css";
import "../src/index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";
import MyRequest from "./Components/MyRequest";
import Home from "./Components/Home";
import MyNav from "./Components/Navbar";
import Travel from "./Components/Travel";
import "leaflet/dist/leaflet.css";
import Driver from "./Components/Driver";
import Rider from "./Components/Rider";
import DriverLogin from "./Components/DriverLogin";
import RiderLogin from "./Components/RiderLogin";
import RegisterDriver from "./Components/RegisterDriver";
import RegisterRider from "./Components/RegisterRider";
import Logout from "./Components/logout";

export default function App() {
  return (
    <BrowserRouter>
        <MyNav/>
        <Container>
          <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/myrequests" element={<MyRequest/>}/>
              <Route path="/rider/request" element={<Travel/>}/>
              <Route path="/rider" element={<Rider/>}/>
              <Route path="/driver" element={<Driver/>}/>
              <Route path="/driver/login" element={<DriverLogin/>}/>
              <Route path="/driver/register" element={<RegisterDriver/>}/>
              <Route path="/rider/login" element={<RiderLogin/>}/>
              <Route path="/rider/register" element={<RegisterRider/>}/>
              <Route path="/logout" element={<Logout/>}/>
          </Routes>
        </Container>
    </BrowserRouter>
  );
}
