import React, { Fragment } from "react";
import { Menu, Modal, Form, Icon, Input, Button } from "semantic-ui-react";
import validateChannelInput from "./validator";
import firebase from "../../../firebase";
import { connect } from "react-redux";
import { setCurrentChannel } from "../../../actions";

class Channels extends React.Component {
  state = {
    channels: [],
    channelName: "",
    channelDetails: "",
    isOpen: false,
    channelsRef: firebase.database().ref("channels"),
    errors: {},
    firstLoad: true
  };

  componentDidMount = () => {
    this.addListeners();
  };

  componentWillUnmount = () => {
    this.removeListeners();
  };

  removeListeners = () => {
    const { channelsRef } = this.state;

    channelsRef.off();
  };

  addListeners = () => {
    const { channelsRef } = this.state;
    let loadedChannels = [];

    channelsRef.on("child_added", snap => {
      loadedChannels.push(snap.val());
      this.setState({ channels: loadedChannels }, () => this.setFirstChannel());
    });
  };

  setFirstChannel = () => {
    const { firstLoad, channels } = this.state;
    const { setCurrentChannel } = this.props;
    const firstChannel = channels[0];

    if (firstLoad && channels.length > 0) {
      setCurrentChannel(firstChannel);
    }
    this.setState({ firstLoad: false });
  };

  closeModal = () => this.setState({ isOpen: false });

  openModal = () => this.setState({ isOpen: true });

  handleChange = e => {
    const { name, value } = e.target;

    this.setState({ [name]: value });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { errors, isValid } = validateChannelInput(this.state);
    this.setState({ errors: errors });

    if (isValid) {
      console.log("Channel added");
      this.addChannel();
    }
  };

  addChannel = () => {
    const { channelsRef, channelName, channelDetails } = this.state;
    const { currentUser } = this.props;
    const key = channelsRef.push().key;

    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: currentUser.displayName,
        avatar: currentUser.photoURL
      }
    };

    channelsRef
      .child(key)
      .update(newChannel)
      .then(() => {
        this.setState({
          channelDetails: "",
          channelName: ""
        });
        this.closeModal();
        console.log("Channel added");
      })
      .catch(err => console.error(err));
  };

  displayChannels = (channels, currentChannel) =>
    channels.length > 0 &&
    channels.map(channel => (
      <Menu.Item
        key={channel.id}
        onClick={() => this.changeChannel(channel)}
        name={channel.name}
        style={{ opacity: 0.7 }}
        active={currentChannel && channel.id === currentChannel.id}
      >
        # {channel.name}
      </Menu.Item>
    ));

  changeChannel = channel => {
    const { setCurrentChannel } = this.props;
    setCurrentChannel(channel);
  };

  render() {
    const { channels, isOpen } = this.state;
    const { currentChannel } = this.props;
    return (
      <Fragment>
        <Menu.Menu style={{ paddingButton: "2em" }}>
          <Menu.Item>
            <span>
              <Icon name="exchange" /> CHANNELS
            </span>{" "}
            ({channels.length}) <Icon name="add" onClick={this.openModal} />
            {this.displayChannels(channels, currentChannel)}
          </Menu.Item>
        </Menu.Menu>

        <Modal basic open={isOpen} onClose={this.closeModal}>
          <Modal.Header>Add a Channel</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Field>
                <Input
                  fluid
                  label="Name of Channel"
                  name="channelName"
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field>
                <Input
                  fluid
                  label="About the Channel"
                  name="channelDetails"
                  onChange={this.handleChange}
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" inverted onClick={this.handleSubmit}>
              <Icon name="checkmark" /> Add
            </Button>
            <Button color="red" inverted onClick={this.closeModal}>
              <Icon name="remove" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel
});

export default connect(
  mapStateToProps,
  { setCurrentChannel }
)(Channels);
