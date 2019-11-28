import React from 'react';
import PropTypes from 'prop-types';
import {MuiThemeProvider, withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import {Api} from "~/src/util/apis";
import classNames from "classnames";
import Select from "@material-ui/core/Select";
import ChatForm from '~/src/component/ChatForm'
import Drawer from "../component/MainHeader";
import {theme} from "../theme/theme";
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import SettingsIcon from '@material-ui/icons/Settings';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Grid from '@material-ui/core/Grid';
import FriendList from '~src/component/FriendList'
import Paper from '@material-ui/core/Paper';


const styles = theme => ({
    content: {
        flexGrow: 1,
        // padding: theme.spacing.unit * 3,
    },
    appBar: {
        position: 'relative',
    },
    flex: {
        flex: 1,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width:640,
    },
    gridRight:{
        [theme.breakpoints.down('sm')]: {
            display:'none',
            backgroundColor: 'red'
        }
    },
});

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class ChatScreenDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            multiline: 'Controlled',
            contents: ''
        }
    };

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose =async event => {
        // await Api.postRecruitContents("",this.state.contents)
        await this.setState({ open: false });
    };
    handleChange = async event => {
        await this.setState({
            [event.target.name]: event.target.value,
        });
        await console.log(this.state.contents)
    };
    render() {
        const { classes } = this.props;
        return (
            <div>
                <div onClick={this.handleClickOpen}>
                    <SupervisedUserCircleIcon />
                    {/*<ListItemText primary={"Chat"} />*/}
                </div>
                <Dialog
                    fullScreen
                    open={this.state.open}
                    onClose={this.handleClose}
                    TransitionComponent={Transition}
                >
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="h6" color="inherit" className={classes.flex}>
                                Chat
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <main className={classes.content}>
                        <Grid container spacing={2}>
                            <Grid item md={3} sm={12} xs={12}>
                                <FriendList/>
                            </Grid>
                            <Grid item md={0} sm={0} xs={0} className={classes.gridRight}>
                                <ChatForm/>
                            </Grid>
                        </Grid>
                    </main>
                </Dialog>
            </div>
        );
    }
}

ChatScreenDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChatScreenDialog);