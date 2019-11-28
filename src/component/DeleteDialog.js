import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import ListItem from "@material-ui/core/ListItem";
import PropTypes from "prop-types";
import {compose} from "redux";
import {mapDispatchToProps, mapStateToProps} from "../action";
import {withStyles} from '@material-ui/core/styles';
import {connect} from "react-redux";

function Transition(props) {
    return <Slide direction="up" {...props} />;
}
const styles = theme => ({
    delete_icon:{
        color:"red",
        cursor: "pointer"
    }
})

class DeleteDialog extends React.Component {
        state = {
        open: false,
    };

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    render() {
        const { classes } = this.props;
        return (
            <div>
                <span>
                   <DeleteForeverIcon className={classes.delete_icon} onClick={this.handleClickOpen} />
                </span>
                <Dialog
                    open={this.state.open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    {/*<DialogTitle id="alert-dialog-slide-title">*/}
                        {/*{"Use Google's location service?"}*/}
                    {/*</DialogTitle>*/}
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            下書きを削除します。<br />
                            よろしいですか？
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            いいえ
                        </Button>
                        <Button onClick={() =>this.props.delete()} color="primary">
                            はい
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

DeleteDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};
// export default withStyles(styles)(InputProfile);
export default compose(
    withStyles(styles,{ withTheme: true }),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(DeleteDialog)