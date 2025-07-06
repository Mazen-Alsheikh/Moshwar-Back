import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";

const Rider = () =>{

    const navigate = useNavigate();

    return (
        <div className="text-center mt-5">
            <h4>قم بطلب مشوارك الأن</h4>
            <Button onClick={() => navigate("/rider/request")}>أطلب مشوار</Button>
        </div>
    )
}

export default Rider;