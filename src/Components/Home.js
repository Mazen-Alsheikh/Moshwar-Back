import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router";

const Home = () =>{

    const navigate = useNavigate();

    if (sessionStorage.getItem("rider")) {
        return navigate("/rider");
    }
    
    if (sessionStorage.getItem("driver")) {
        return navigate("/driver");
    }

    return (
        <div className="text-center mt-5">
            <h4 className="mb-4 text-primary">أختر الخدمة</h4>
            <Button onClick={() => navigate("/rider/login")} className="ms-3 bg-success">راكب</Button>
            <Button onClick={() => navigate("/driver/login")}>سائق</Button>
        </div>
    )
}

export default Home;