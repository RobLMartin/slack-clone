import React, { Component } from "react";
import firebase from "../../../firebase";
import md5 from "md5";
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

class Register extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    errors: {},
    loading: false,
    usersRef: firebase.database().ref("users")
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { email, password } = this.state;
    const { errors, isValid } = validateRegisterInput(this.state);

    if (isValid) {
      this.setState({ errors: {}, loading: true }, () =>
        firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then(createdUser => {
            console.log(createdUser);
            createdUser.user
              .updateProfile({
                displayName: this.state.username,
                photoURL: `http://gravatar.com/avatar/${md5(
                  createdUser.user.email
                )}?d=identicon`
              })
              .then(() => {
                this.saveUser(createdUser).then(() => {
                  console.log("user saved");
                  this.setState({ loading: false });
                });
              })
              .catch(err => {
                console.error(err);
                this.setState({
                  errors: { firebase: err.message, ...this.state.errors },
                  loading: false
                });
              });
          })
          .catch(err => {
            this.setState({
              errors: { firebase: err.message, ...errors },
              loading: false
            });
          })
      );
    } else {
      this.setState({ errors: errors });
    }
  };

  saveUser = createdUser => {
    return this.state.usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL
    });
  };

  render() {
    const {
      username,
      email,
      password,
      passwordConfirmation,
      errors,
      loading
    } = this.state;
    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" icon color="orange" textAlign="center">
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
                className={errors["passwordInvalid"] && "error"}
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
                className={errors["passwordInvalid"] && "error"}
                type="password"
              />
              <Button
                disabled={loading}
                className={loading ? "loading" : ""}
                color="orange"
                fluid
                size="large"
              >
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
