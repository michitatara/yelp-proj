import React, { useState } from "react";
import "./HomePage.css";
import { Formik } from "formik";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Pagination from "react-bootstrap/Pagination";
import * as yup from "yup";
import { searchBusiness } from "./requests";
import { days } from "./exports";
const schema = yup.object({
  term: yup.string().required("Term is required"),
  location: yup.string().required("Location is required"),
});
function HomePage() {
  const [results, setResults] = useState([]);
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({});
  const getBusiness = async params => {
    const response = await searchBusiness(params);
    setTotal(response.data.search.total);
    setResults(response.data.search.business);
  };
  const changePage = async page => {
    setPage(page);
    setOffset((page - 1) * 20);
    params.offset = (page - 1) * 20;
    setParams(params);
    getBusiness(params);
  };
  const handleSubmit = async evt => {
    const isValid = await schema.validate(evt);
    if (!isValid) {
      return;
    }
    evt.offset = offset;
    setParams(evt);
    getBusiness(evt);
  };
  return (
    <div className="home-page">
      <h1 className="center">Business Search</h1>
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
                <Form.Label>Term</Form.Label>
                <Form.Control
                  type="text"
                  name="term"
                  placeholder="Term"
                  value={values.term || ""}
                  onChange={handleChange}
                  isInvalid={touched.term && errors.term}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.term}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="12" controlId="url">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={values.location || ""}
                  onChange={handleChange}
                  isInvalid={touched.location && errors.location}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.location}
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
          disabled={page === 0}
        />
        <Pagination.Next
          onClick={changePage.bind(this, page + 1)}
          disabled={Math.ceil(total / 20) === page}
        />
        <Pagination.Last
          onClick={changePage.bind(this, Math.max(Math.floor(total / 20)), 0)}
        />
      </Pagination>
    </div>
  );
}
export default HomePage;