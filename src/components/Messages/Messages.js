import React, { Fragment } from "react";
import { Segment, Comment } from "semantic-ui-react";
import firebase from "../../firebase";
import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import Message from "./Message";
import { connect } from "react-redux";
import styled from "styled-components";

class Messages extends React.Component {
  state = {
    messagesRef: firebase.database().ref("messages"),
    messages: [],
    loading: true
  };

  componentDidMount = () => {
    const { currentChannel, currentUser } = this.props;
    if (currentChannel && currentUser) {
      this.addListeners(currentChannel.id);
    }
  };

  addListeners = channelId => {
    this.addMessageListener(channelId);
  };

  addMessageListener = channelId => {
    const { messagesRef } = this.state;
    let loadedMessages = [];
    messagesRef.child(channelId).on("child_added", snap => {
      loadedMessages.push(snap.val());
      this.setState({ messages: loadedMessages, loading: false });
      console.log(loadedMessages);
    });
  };

  displayMessages = messages => {
    console.log(messages);
    return (
      messages.length > 0 &&
      this.props.currentUser &&
      messages.map(message => (
        <Message
          key={message.timestamp}
          user={this.props.currentUser}
          message={message}
        />
      ))
    );
  };

  render() {
    const { messagesRef, messages } = this.state;

    return (
      <Fragment>
        <MessagesHeader />

        <Segment>
          <Comment.Group className="messages">
            {this.displayMessages(messages)}
          </Comment.Group>
        </Segment>

        <MessageForm messagesRef={messagesRef} />
      </Fragment>
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
)(Messages);
