import React, { Component } from "react";
import { Segment, Button, Input } from "semantic-ui-react";
import { connect } from "react-redux";
import uuidv4 from "uuid/v4";
import firebase from "../../firebase";
import FileModal from "./FileModal";

class MessageForm extends Component {
  state = {
    message: "",
    loading: false,
    errors: {},
    modal: false,
    uploadState: "",
    uploadTask: null,
    storageRef: firebase.storage().ref(),
    percentUploaded: 0
  };

  openModal = () => this.setState({ modal: true });
  closeModal = () => this.setState({ modal: false });

  handleChange = ({ name, value }) => {
    this.setState({ [name]: value });
  };

  createMessage = (fileUrl = null) => {
    const { message } = this.state;
    const { uid, displayName, photoURL } = this.props.currentUser;
    const newMessage = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: uid,
        name: displayName,
        avatar: photoURL
      }
    };

    if (fileUrl !== null) {
      newMessage["image"] = fileUrl;
    } else {
      newMessage["content"] = this.state.message;
    }

    return newMessage;
  };

  sendMessage = () => {
    const { messagesRef, currentChannel } = this.props;
    const { message, errors } = this.state;
    if (message) {
      this.setState({ loading: true });
      messagesRef
        .child(currentChannel.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({ loading: false, message: "", errors: {} });
        })
        .catch(err => {
          console.error(err);
          this.setState({
            loading: false,
            errors: { ...errors, firebase: err.message }
          });
        });
    } else {
      this.setState({ errors: { ...errors, noMsg: "Add a message" } });
    }
  };

  uploadFile = (file, metadata) => {
    const pathToUpload = this.props.currentChannel.id;
    const ref = this.props.messagesRef;
    const filePath = `chat/public/${uuidv4()}.jpg`;

    this.setState(
      {
        uploadState: "uploading",
        uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
      },
      () => {
        this.state.uploadTask.on(
          "state_changed",
          snap => {
            const percentUploaded = Math.round(
              (snap.bytesTransferred / snap.totalBytes) * 100
            );
            this.setState({ percentUploaded });
          },
          err => {
            console.error(err);
            this.setState({
              errors: { ...this.state.errors, uploadErr: err.message },
              uploadState: "error",
              uploadTask: null
            });
          },
          () => {
            this.state.uploadTask.snapshot.ref
              .getDownloadURL()
              .then(downloadUrl => {
                this.sendFileMessage(downloadUrl, ref, pathToUpload);
              })
              .catch(err => {
                console.error(err);
                this.setState({
                  errors: { ...this.state.errors, uploadErr: err.message },
                  uploadState: "error",
                  uploadTask: null
                });
              });
          }
        );
      }
    );
  };

  sendFileMessage = (fileUrl, ref, pathToUpload) => {
    ref
      .child(pathToUpload)
      .push()
      .set(this.createMessage(fileUrl))
      .then(() => {
        this.setState({ uploadState: "done" });
      })
      .catch(err => {
        console.error(err);
        this.setState({
          errors: { ...this.state.errors, uploadError: err.message }
        });
      });
  };

  render() {
    const { message, errors, loading, modal } = this.state;
    return (
      <Segment className="message__form">
        <Input
          value={message}
          onChange={e => this.handleChange(e.target)}
          fluid
          name="message"
          style={{ marginBottom: "0.7em" }}
          label={<Button icon="add" />}
          labelPosition="left"
          placeholder="write your message"
          className={errors.noMsg && "error"}
        />

        <Button.Group icon widths="2">
          <Button
            onClick={this.sendMessage}
            disabled={loading}
            color="orange"
            content="Add Reply"
            labelPosition="left"
            icon="edit"
          />
          <Button
            color="teal"
            onClick={this.openModal}
            content="Upload Media"
            labelPosition="right"
            icon="cloud upload"
          />
          <FileModal
            modal={modal}
            onClick={this.closeModal}
            uploadFile={this.uploadFile}
          />
        </Button.Group>
      </Segment>
    );
  }
}

const mapStateToProps = state => ({
  currentChannel: state.channel.currentChannel,
  currentUser: state.user.currentUser
});

export default connect(
  mapStateToProps,
  {}
)(MessageForm);
