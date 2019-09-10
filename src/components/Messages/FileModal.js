import React from "react";
import mime from "mime-types";
import { Modal, Input, Button, Icon } from "semantic-ui-react";

const authorized = ["image/jpeg", "image/png"];

class FileModal extends React.Component {
  state = {
    file: null
  };

  addFile = event => {
    const file = event.target.files[0];

    console.log(file);
    if (file) {
      this.setState({ file });
    }
  };

  sendFile = () => {
    const { file } = this.state;
    const { uploadFile, onClick } = this.props;

    if (file !== null) {
      if (this.isAuthorized(file.name)) {
        const metadata = { contentType: mime.lookup(file.name) };
        uploadFile(file, metadata);
        onClick();
        this.clearFile();
      }
    }
  };

  isAuthorized = filename => authorized.includes(mime.lookup(filename));

  clearFile = () => this.setState({ file: null });

  render() {
    const { modal, onClick } = this.props;
    return (
      <Modal basic open={modal} onClose={onClick}>
        <Modal.Header>Select an Image File</Modal.Header>
        <Modal.Content>
          <Input
            onChange={this.addFile}
            fluid
            label="File types: jpg, png"
            name="file"
            type="file"
          />
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" inverted onClick={this.sendFile}>
            <Icon name="checkmark" /> Send
          </Button>
          <Button color="red" inverted onClick={onClick}>
            <Icon name="remove" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default FileModal;
