import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import store from "../store";
import Grid from "@material-ui/core/Grid";

class ConfirmDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    componentWillMount() {
    }

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = async () => {
        await this.setState({ open: false });
        await this.props.parentHandleClose()
    };

    render() {
        const { fullScreen } = this.props;

        return (
            <div>
                <Dialog
                // fullScreen={fullScreen}
                open={this.props.open}
                onClose={this.handleClose}
                aria-labelledby="responsive-dialog-title"
                >
                        <DialogTitle id="responsive-dialog-title">{"保存しました。"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                {this.props.text}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleClose} color="secondary" autoFocus>
                                OK
                            </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

ConfirmDialog.propTypes = {
    fullScreen: PropTypes.bool.isRequired,
};

export default withMobileDialog()(ConfirmDialog);