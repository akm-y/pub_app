import React,{Component} from 'react'
import socketio from 'socket.io-client'
import {withStyles} from "@material-ui/core";
import UserList from "../component/UserList";
import store from "~/src/store";
import Api from "~/src/util/apis";
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import MainHeader from "../component/MainHeader";
import ChatForm from '~/src/component/ChatForm'
import Avatar from '@material-ui/core/Avatar';

const drawerWidth = 240;
const styles = theme => ({
    chat:{
        // width:640,
        // padding:'0 40'
    },
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    borderY:{
        borderRight:'solid 1px lightgray'
    },
    left:{
        height:'100%',
        paddingBottom:20
    },
    content: {

    },
    right:{
        margin: '0 auto',
        paddingTop:20,
        paddingBottom:20
    },
    avatar: {
        marginRight: 10,
    },
    bigAvatar: {
        // margin: 10,
        width: 45,
        height: 45,
    },
    name: {
        fontSize:16
    }
});

class Chat extends Component {
    constructor(props){
        super(props)
        this.state = {
            friends:[],
            items:[],
            logs:[],
            user_id: store.getState().user_id,
            chat_user_id:'',
            list_show_flg:false,
            display_loading:false
        }
    }

    componentDidMount = async()=>{
        let _this = this
        let params = new URLSearchParams();
        params.set('user_id', store.getState().user_id);

        await Api.getFriends(params).then(
            function(response){
                console.log(response)
                _this.setState({
                    friends:response.friends
                });
                if(_this.state.friends.length > 0){
                    _this.setState({
                        list_show_flg:true
                    })
                }
                _this.setState({
                    display_loading:false,
                })

            }
        );

    }
    nameChanged(e){
        this.setState({name: e.target.value})
    }
    //このイベントの発生時、this.state.nameにvalueの値が入る
    messageChanged(e){
        this.setState({message: e.target.value})
    }
    selectUser = async(chat_user_id)=>{
        this.refs.chatform.setChatUserId(chat_user_id)
    }
    render(){
        const { classes } = this.props;

        return(
            <div>
                {/*<CssBaseline />*/}
                {/*<AppBar position="fixed" className={classes.appBar}>*/}
                {/*    <Toolbar>*/}
                {/*        <Typography variant="h6" noWrap>*/}
                {/*            Clipped drawer*/}
                {/*        </Typography>*/}
                {/*    </Toolbar>*/}
                {/*</AppBar>*/}

                <Grid container justify="flex-center" className={classes.mainContents}
                >
                    <Grid
                        item xs={3}
                        className={classes.borderY}
                        variant="permanent"
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                    >
                        <div className={classes.toolbar} />
                        <List>
                            {(this.state.list_show_flg)?
                                this.state.friends.map(function (value, id) {
                                return(
                                    <ListItem button key={value.user_id} onClick={() =>this.selectUser(value.user_id)}>
                                        <Grid container justify="start" alignItems="center">
                                            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" className={classes.avatar} />
                                            <ListItemIcon className={classes.name}>
                                                {value.profile.basic_info.first_name} {value.profile.basic_info.last_name}
                                            </ListItemIcon>
                                        </Grid>
                                        {/*<ListItemText primary={id} />*/}
                                    </ListItem>
                                )
                                }, this):
                                    <Grid container justify="center">
                                        <p>メンバーがいません</p>
                                    </Grid>
                            }
                        </List>
                        <Divider />
                    </Grid>
                    <Grid item xs={9}>
                        <main className={classes.content}>
                            <ChatForm ref="chatform"/>
                        </main>
                    </Grid>
                    {/*<Grid item xs={3}>*/}
                    {/*    <main className={classes.right}>*/}
                    {/*    あゝあゝ*/}
                    {/*    </main>*/}
                    {/*</Grid>*/}
                </Grid>
            </div>
        )
    }
}
export default withStyles(styles, { withTheme: true })(Chat);
