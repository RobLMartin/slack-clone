import React from "react";
import { Modal, Input, Button, Icon } from "semantic-ui-react";

class FileModal extends React.Component {
  render() {
    const { modal, onClick } = this.props;
    return (
      <Modal basic open={modal} onClose={onClick}>
        <Modal.Header>Select an Image File</Modal.Header>
        <Modal.Content>
          <Input fluid label="File types: jpg, png" name="file" type="file" />
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" inverted>
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
