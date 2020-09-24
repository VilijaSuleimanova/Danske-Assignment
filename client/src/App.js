import React, { useState, useEffect } from "react";
import "./App.css";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Formik } from "formik";

import { gql, useMutation } from "@apollo/client";

function App() {
    const MONTHLY_PAYMENTS = gql`
        mutation getOffer($id: Int!) {
            person(id: $id) {
                facilityId
                exposureId
                exposure {
                    monthlyPayment
                }
                facility {
                    loanDuration
                    loanDurationType
                }
            }
        }
    `;

    const [userData, setUserData] = useState(null);

    const [search, { data }] = useMutation(MONTHLY_PAYMENTS);

    useEffect(() => {
        if (typeof data !== "undefined") {
            setUserData(data);
        }
    }, [data]);

    return (
        <div className="App">
            <Container>
                <Row className="justify-content-md-center">
                    <Nav fill variant="tabs" defaultActiveKey="/my-account" as="ul" className="mt-2">
                        <Nav.Item as="li">
                            <Nav.Link eventKey="/my-account" className="tx-drk-blue">
                                My Danske Bank Account
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Row>
                <Row className="mt-2">
                    <Col xs lg="6" bg="light">
                        <Card className="fullHeight">
                            <Card.Body className="note-style">
                                Dear Customer, congrats, you are entitled to receive a loan! Just enter your user ID and
                                we will present an offer with monthly payments!
                                <Formik
                                    initialValues={{ userAccount: "" }}
                                    validate={(values) => {
                                        const errors = {};
                                        if (!values.userAccount) {
                                            errors.userAccount = "Required";
                                        } else if (!/^[1-9][0-9]{0,3}$/.test(values.userAccount)) {
                                            errors.userAccount = "Invalid Id";
                                        }
                                        return errors;
                                    }}
                                    onSubmit={(values) => {
                                        search({ variables: { id: parseInt(values.userAccount) } });
                                        values.userAccount = "";
                                    }}
                                >
                                    {({ values, errors, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                                        <Form onSubmit={handleSubmit} className="formStyle">
                                            <Form.Group>
                                                <Form.Control
                                                    size="lg"
                                                    type="text"
                                                    placeholder="Your ID..."
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    name="userAccount"
                                                    value={values.userAccount}
                                                />
                                                <div className="text-danger">{errors.userAccount}</div>
                                            </Form.Group>
                                            <Button
                                                variant="primary"
                                                type="submit"
                                                disabled={typeof errors === "undefined"}
                                            >
                                                Submit
                                            </Button>
                                        </Form>
                                    )}
                                </Formik>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col xs lg="6">
                        <Card bg="info fullHeight">
                            <Card.Body className="text-light">
                                {userData !== null && (
                                    <>
                                        <h1>Woohoo!</h1>
                                        <p className="font40">
                                            Based on our very sofiticated calculations we can provide you a{" "}
                                            {userData.person.facility.loanDurationType} loand and you will have to pay €
                                            {userData.person.exposure.monthlyPayment} each month for{" "}
                                            {userData.person.facility.loanDuration} months and in total you will pay us
                                            back €
                                            {userData.person.exposure.monthlyPayment *
                                                userData.person.facility.loanDuration}
                                        </p>
                                    </>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default App;
