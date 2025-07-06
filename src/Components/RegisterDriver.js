import { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router';

function RegisterDriver() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handelSubmit = (e) => {

    e.preventDefault();

    fetch("http://localhost:5000/driver/register",
      { method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            phone,
            email,
            password
        })
      }
    ).then(async res => {
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      if (data.message === "تم تسجيل الدخول بنجاح") {
        sessionStorage.setItem("driver", JSON.stringify(data.data));
        setMessage(data.message + " ✅");

        setTimeout(() => {
          setMessage("");
        }, 2000);

        setTimeout(() => {
          window.location.href = "/";
        }, 1000);

      }
    })
    .catch(err => { 
      setError(err.message);
      setTimeout(() => {
        setError("");
      }, 3000);
    });

  }

  return (
    <>
      {message && (
        <div className='alert alert-success text-center my-3'>
          {message}
        </div>
      )}
      {error && (
        <div className='alert alert-danger text-center my-3'>
          {error}
        </div>
      )}
      <Row className='mt-4 d-flex justify-content-center'>
          <Col sm="8">
            <Form onSubmit={handelSubmit}>
              <h5 className='text-primary text-center'>إنشاء حساب راكب</h5>

              <Form.Group className="mb-3">
                <Form.Label>إسم الراكب</Form.Label>
                <Form.Control onChange={(e) => setName(e.target.value)} name='name' type="text" placeholder="أكتب إسمك" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>البريد الإلكتروني</Form.Label>
                <Form.Control onChange={(e) => setEmail(e.target.value)} name='email' type="email" placeholder="أكتب البريد الإلكتروني" />
                <Form.Text className="text-muted">
                  لاتشاركه مع اي أحد.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>رقم الموبايل</Form.Label>
                <Form.Control onChange={(e) => setPhone(e.target.value)} name='phone' type="number" placeholder="أكتب رقم الموبايل" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>كلمة المرور</Form.Label>
                <Form.Control onChange={(e) => setPassword(e.target.value)} name='password' type="password" placeholder="أكتب كلمة المرور" />
              </Form.Group>
              <Button variant="primary" type="submit">
                تسجيل الدخول
              </Button>
            </Form>
            <p>لديك حساب بالفعل ؟ 
              <span onClick={() => navigate("/driver/login")}> تسجيل الدخول</span>
            </p>
          </Col>
      </Row>
    </>
  );
}

export default RegisterDriver;