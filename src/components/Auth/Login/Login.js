import React, { Component } from "react";
import firebase from "../../../firebase";
import validateLoginInput from "./validator";
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

class Login extends Component {
  state = {
    email: "",
    password: "",
    errors: {},
    loading: false
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { email, password } = this.state;
    const { errors, isValid } = validateLoginInput(this.state);

    if (isValid) {
      this.setState({ errors: {}, loading: true }, () =>
        firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then(signedInUser => {
            console.log(signedInUser);
            this.setState({ errors: {}, loading: false });
          })
          .catch(err => {
            console.error(err);
            this.setState({
              errors: { firebase: err.message, ...this.state.errors },
              loading: false
            });
          })
      );
    }
  };

  render() {
    const { email, password, errors, loading } = this.state;
    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" icon color="violet" textAlign="center">
            <Icon name="code branch" color="violet" />
            Login to DevChat
          </Header>
          <Form onSubmit={this.handleSubmit} size="large">
            <Segment stacked>
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
                className={errors["passwordInvalid"] && "error"}
                type="password"
              />

              <Button
                disabled={loading}
                className={loading ? "loading" : ""}
                color="violet"
                fluid
                size="large"
              >
                Submit
              </Button>
              <Message>
                Dont have an account? <Link to="/register">Register</Link>
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

export default Login;
