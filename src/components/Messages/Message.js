import React from "react";
import { Comment, Image } from "semantic-ui-react";
import moment from "moment";

const isOwnMessage = (message, user) =>
  message.user.id === user.uid ? "message__self" : "";

const isImage = message => {
  return message.hasOwnProperty("image") && !message.hasOwnProperty("content");
};

const timeFromNow = timestamp =>
  moment(timestamp)
    .fromNow()
    .toString();

const Message = ({ user, message }) => (
  <Comment>
    <Comment.Avatar src={message.user.avatar} />
    <Comment.Content className={isOwnMessage(message, user)}>
      <Comment.Author as="a">{message.user.name}</Comment.Author>
      <Comment.Metadata>{timeFromNow(message.timestamp)}</Comment.Metadata>
      <Comment.Text>{message.content}</Comment.Text>
      {isImage(message) ? (
        <Image src={message.image} className="message__image" />
      ) : (
        <Comment.Text>{message.content}</Comment.Text>
      )}
    </Comment.Content>
  </Comment>
);

export default Message;
