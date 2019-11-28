import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import ProfileBasicEdit from "./ProfileBasicEdit";
import ProfileCareerEdit from "./ProfileCareerEdit"
import ConfirmDialog from './ConfirmDialog'
import Grid from '@material-ui/core/Grid';

import store from "../store";
import Api from "~/src/util/apis";

const useStyles = makeStyles(theme => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    button:{
        width:"100%"
    }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [dialog, setDialog] = React.useState(false);
    const [text, setText] = React.useState("前の画面に戻ります。");

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setDialog(false)
    };
    const goNext = () => {
        setDialog(true)
    };
    const goError = () => {
        alert("通信に失敗しました。")
    };
    const profileRegister = async() =>{
        let _this = this
        let params = new URLSearchParams();
        params.set('user_id', store.getState().user_id);
        params.set('profile', JSON.stringify(store.getState().profile));

        await Api.postProfile(params).then(
            await function(response) {
                console.log(response)
            },
        ).then(
            await goNext
        ).catch(
            await goError
        )
    };
    const photoRegister = async() =>{
        let params = new URLSearchParams();
        params.set('user_id', store.getState().user_id);
        params.set('user_photo', store.getState().user_photo);
        console.log(store.getState().user_id)

        await Api.postUserPhoto(params).then(
            await function(response) {
                profileRegister
            },
        ).then(
            await goNext
        ).catch(
            await goError
        )
    }

    return (
        <div>
            <Grid container item sm={12} xs={12} md={12} >
                <Button variant="contained" color="primary" className={classes.button} onClick={handleClickOpen}>
                    プロフィールを編集
                </Button>
            </Grid>
            <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            プロフィール編集
                        </Typography>
                        <Button autoFocus color="inherit" onClick={photoRegister}>
                            保存
                        </Button>
                    </Toolbar>
                </AppBar>
                <ProfileBasicEdit />
                <ConfirmDialog open={dialog}　text={text} parentHandleClose={handleClose}/>
            </Dialog>
        </div>
    );
}