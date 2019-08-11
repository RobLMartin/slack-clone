import React, { Component } from "react";
import firebase from "../../../firebase";
import validateRegisterInput from "./validator";
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import { create } from "domain";

class Register extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    errors: {}
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = event => {
    const { email, password } = this.state;

    const { errors, isValid } = validateRegisterInput(this.state);

    if (isValid) {
      event.preventDefault();
      this.setState({ errors: {} }, () =>
        firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then(createdUser => {
            console.log(createdUser);
          })
          .catch(err => console.error(err))
      );
    } else {
      this.setState({ errors });
    }
  };

  render() {
    const {
      username,
      email,
      password,
      passwordConfirmation,
      errors
    } = this.state;
    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" icon color="orange" textAlign="center">
            <Icon name="puzzle piece" color="orange" />
            Register for DevChat
          </Header>
          <Form onSubmit={this.handleSubmit} size="large">
            <Segment stacked>
              <Form.Input
                value={username}
                fluid
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="Username"
                onChange={this.handleChange}
                type="text"
              />
              <Form.Input
                value={email}
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email Address"
                onChange={this.handleChange}
                type="email"
              />
              <Form.Input
                value={password}
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                onChange={this.handleChange}
                type="password"
              />
              <Form.Input
                value={passwordConfirmation}
                fluid
                name="passwordConfirmation"
                icon="repeat"
                iconPosition="left"
                placeholder="Password Confirmation"
                onChange={this.handleChange}
                type="password"
              />
              <Button color="orange" fluid size="large">
                Submit
              </Button>
              <Message>
                Already a user? <Link to="/login">Login</Link>
              </Message>
            </Segment>
          </Form>
          {Object.keys(errors).map(error => (
            <Message error key={error}>
              <h3>{errors[error]}</h3>
            </Message>
          ))}
        </Grid.Column>
      </Grid>
    );
  }
}

export default Register;
