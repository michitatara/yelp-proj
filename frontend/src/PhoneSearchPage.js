import React, { useState } from "react";
import { Formik } from "formik";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Pagination from "react-bootstrap/Pagination";
import * as yup from "yup";
import { searchPhone } from "./requests";
import { days } from "./exports";
const schema = yup.object({
  phone: yup.string().required("Phone is required"),
});
function PhoneSearchPage() {
  const [results, setResults] = useState([]);
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({});
  const getEvents = async params => {
    const response = await searchPhone(params);
    setTotal(response.data.phone_search.total);
    setResults(response.data.phone_search.business);
  };
  const changePage = async page => {
    setPage(page);
    setOffset((page - 1) * 20);
    params.offset = (page - 1) * 20;
    setParams(params);
    getEvents(params);
  };
  const handleSubmit = async evt => {
    const isValid = await schema.validate(evt);
    if (!isValid) {
      return;
    }
    evt.offset = offset;
    setParams(evt);
    getEvents(evt);
  };
  return (
    <div className="home-page">
      <h1 className="center">Phone Search</h1>
      <Formik validationSchema={schema} onSubmit={handleSubmit}>
        {({
          handleSubmit,
          handleChange,
          handleBlur,
          values,
          touched,
          isInvalid,
          errors,
        }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Row>
              <Form.Group as={Col} md="12" controlId="name">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={values.phone || ""}
                  onChange={handleChange}
                  isInvalid={touched.phone && errors.phone}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.phone}
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Button type="submit">Search</Button>
          </Form>
        )}
      </Formik>
      <br />
      {results.map((r, i) => {
        return (
          <Card key={i}>
            <Card.Title className="card-title">{r.name}</Card.Title>
            <Card.Body>
              <p>
                Address: {r.location.address1}, {r.location.city},{" "}
                {r.location.country}, {r.location.state}
              </p>
              <p>Rating: {r.rating}</p>
              <p>Open Now: {r.hours[0].is_open_now ? "Yes" : "No"}</p>
              <p>Hours:</p>
              <ul>
                {r.hours[0] &&
                  r.hours[0].open.map((h, i) => (
                    <li key={i}>
                      {days[h.day]}: {h.start} - {h.end}
                    </li>
                  ))}
              </ul>
            </Card.Body>
          </Card>
        );
      })}
      <br />
      <Pagination>
        <Pagination.First onClick={changePage.bind(this, 1)} />
        <Pagination.Prev
          onClick={changePage.bind(this, page - 1)}
          disabled={page == 0}
        />
        <Pagination.Next
          onClick={changePage.bind(this, page + 1)}
          disabled={Math.ceil(total / 20) == page}
        />
        <Pagination.Last
          onClick={changePage.bind(this, Math.max(Math.floor(total / 20)), 0)}
        />
      </Pagination>
    </div>
  );
}
export default PhoneSearchPage;