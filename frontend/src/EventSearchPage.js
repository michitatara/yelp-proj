import React, { useState } from "react";
import { Formik } from "formik";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Pagination from "react-bootstrap/Pagination";
import * as yup from "yup";
import { searchEvents } from "./requests";
const schema = yup.object({
  location: yup.string().required("Location is required"),
});
function EventSearchPage() {
  const [results, setResults] = useState([]);
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({});
const getEvents = async params => {
    const response = await searchEvents(params);
    setTotal(response.data.event_search.total);
    setResults(response.data.event_search.events);
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
      <h1 className="center">Event Search</h1>
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
            <Card.Body></Card.Body>
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
export default EventSearchPage;