import React,{Component} from 'react'
import socketio from 'socket.io-client'
import {withStyles} from "@material-ui/core";
import Api from "../util/apis";
import store from "~/src/store";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from '@material-ui/core/Grid';

import Common from "../util/Common"
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircle from '@material-ui/icons/AccountCircle';
import IconButton from '@material-ui/core/IconButton';
const styles =({
    chat:{
        maxWidth:'100%',
        padding:'0 20px 70px',
        flexGrow: 1,
        margin: '0 auto',
        paddingTop:20,
        paddingBottom:110,
        borderRight:'solid 1px lightgray',
        height:'85vh',
        overflowX:'hidden',
        overflowY:'scroll'

    },
    textField:{
        padding:0
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
        fontSize:10
    },
    messageAreaWrap:{
        width:'100%',
    },
    talk:{
        paddingRight:'0!important',
        paddingLeft:'0!important'

    }
});

const socket = socketio.connect('http://localhost:3005/chat?room=www')
class ChatForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user_id: store.getState().user_id,
            message: '',
            chat_user:{
                first_name:'',
                last_name:'',
                image:'',
                datetime:''
            },
            user:{},
            logs: {log:[]},
            room: [],
            chat_user_id: '',
            this_room_id: '',
            display_loading: false,
            log_exist: false
        }
    }
    componentWillUnmount= async ()=> {
        this.disconnect();
    }
    componentDidMount = async () =>{
        let _this = this
        let params = new URLSearchParams();

        //自分の情報を取得
        params.set('user_id', this.state.user_id);
        await Api.getUser(params).then(
            function(response){
                _this.setState({
                    user:{
                        first_name: response.user.profile.basic_info.first_name,
                        last_name: response.user.profile.basic_info.last_name,
                    }
                });
            }
        );
        //画面アクセス時にソケットコネクションをはる
        await Api.getAllMyRoom(params).then(
            await function(response){
                _this.setState({
                    room:response.room
                });
                socket.emit('roomConnect',_this.state.room)
            }
        );

        //メッセージを受信したときの処理
        socket.on("receiveMessage", (messages) => {
            console.log("messages:"+JSON.stringify(messages))
            let receive = this.state.logs.log
            receive.push(
                messages
            )
            this.setState({
                "logs['log']":receive
            })

        })
    };
    //　会話相手の名前をクリックしたときの処理
    setChatUserId = async(chat_user_id)=>{
        //ローディング
        await this.setState({
            display_loading:true,
        });

        //既に選択済みのユーザクリックは無視する
        if(this.state.chat_user_id === chat_user_id){
            await this.setState({
                display_loading:false,
            });
            return
        }
        //トーク相手
        await this.setState({chat_user_id:chat_user_id});

        //トークを初期化
        this.setState({logs:[]})

        //トーク相手の情報取得
        let _this = this
        let params = new URLSearchParams();
        params.set('user_id', this.state.chat_user_id);

        await Api.getUser(params).then(
            function(response){
                _this.setState({
                    chat_user:{
                        first_name: response.user.profile.basic_info.first_name,
                        last_name: response.user.profile.basic_info.last_name,
                    }
                });
            }
        );

        //　トーク相手とのトーク情報を取得
        let params2 = new URLSearchParams();
        params2.set('user_id', this.state.user_id);
        params2.set('chat_user_id', this.state.chat_user_id);
        await Api.getChatRoom(params2).then(
            await function(response){
                if (Common.isEmpty(response.room)){
                    Api.makeChatRoom(params2).then(
                        function(response){
                            _this.setState({
                                room:response.room,
                                this_room_id: response.room_id
                            });
                            _this.startChat(response.room_id)
                        }
                    )
                } else {
                    _this.setState({this_room_id: _this.state.room.room_id})
                    _this.startChat(_this.state.room.room_id)
                    if(!Common.isEmpty(response.room.logs)){
                        _this.setState({
                            log_exist:true,
                            logs:JSON.parse(response.room.logs)
                        })
                    }
                    _this.setState({
                        room:response.room,
                    })

                }
            }
        );

        //ルーム情報がない場合、初めてのトークとしてルームを新規作成する
        // if(Common.isEmpty(this.state.room)){
        //     await Api.makeChatRoom(params2).then(
        //         await function(response){
        //             _this.setState({
        //                 room:response.room,
        //                 this_room_id: response.room_id
        //             });
        //             _this.startChat(response.room_id)
        //         }
        //     )
        // } else {
        //     _this.setState({this_room_id: this.state.room.room_id})
        //     await this.startChat(this.state.room.room_id)
        // }

        await this.setState({
            display_loading:false,
        })
    };
    startChat = async (room_id)=>{
        await socket.emit('roomConnect',[{
            room_id: room_id,
            user_id: this.state.user_id
        }])
    };
    send = async () => {
        //メッセージにIDを付与
        let key = (this.state.logs.length + 1)

        // 初回のメッセージはlogsが空
        let sendMEssage = {
            id: key,
            name: this.state.user.first_name + this.state.user.last_name,
            message: this.state.message,
            user_id: this.state.user_id,
            room_id: this.state.room.room_id,
        };
        let apiRequestLogs = {}
        if(Common.isEmpty(this.state.logs)){
            apiRequestLogs = {
                "log": [sendMEssage]

            }
        } else {
            apiRequestLogs = this.state.logs
        }
        console.log("sendMEssage:"+ sendMEssage)

        //APIコールしてlogを記録する
        let params = new URLSearchParams();
        params.set('room_id', this.state.room.room_id);
        params.set('logs', JSON.stringify(apiRequestLogs));

         Api.postMessage(params).then(function(response){
            console.log(response)
        })
        socket.emit('chatMessage',sendMEssage);

        this.setState({message: ''})
    }

    disconnect(){
        // socket.emit('roomConnect',_this.state.room)
        // socket.emit('disconnect',{
        //     roomid: room_id
        // })
        //socket.disconnect();
    }
    nameChanged(e){
        this.setState({name: e.target.value})
    }
    //このイベントの発生時、this.state.nameにvalueの値が入る
    messageChanged(e){
        this.setState({message: e.target.value})
    }

    render(){
        const { classes } = this.props;
        const { display_loading } = this.state;

        const loading_style ={
            height:'200px',
            marginTop:'200px',
        }

        if (display_loading) {
            return(
                <div style={loading_style}>
                    <CircularProgress  ariant="determinate" value={this.state.completed} size={24} className={classes.display_loading} />
                </div>
            )
        }

        return(
            <div>
                <div id='chat' className={classes.chat}>
                    <p>{this.state.chat_user.first_name + ' ' + this.state.chat_user.last_name}</p>
                    <List id='log'>
                        {(() => {
                        if(this.state.log_exist){
                            if(!Common.isEmpty(this.state.logs.log)) {
                                return(
                                    this.state.logs.log.map((e) => {
                                        if (this.state.user_id !== e.user_id) {
                                            return (
                                                // 相手の発言（左）
                                                <ListItem className={classes.talk}>
                                                    <Grid container justify="flex-start" >
                                                        <ListItemAvatar>
                                                            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" className={classes.avatar} />
                                                        </ListItemAvatar>
                                                        <ListItemText>
                                                            <Grid item xs={12} >
                                                                <Typography align="left">
                                                                    <p className={classes.name}>{e.name}</p>
                                                                    {/*<div className="balloon-left">*/}
                                                                    <p>{e.message}</p>
                                                                </Typography>
                                                            </Grid>
                                                        </ListItemText>
                                                    </Grid>
                                                </ListItem>
                                            )
                                        } else {
                                            return (
                                                // 自分の発言（右）
                                                <ListItem className={classes.talk}>
                                                    <Grid container justify="flex-end" >
                                                        <ListItemText>
                                                            <Grid item xs={12} >
                                                                <Typography align="right">
                                                                    <p className={classes.name}>あなた</p>
                                                                    {/*<div className="balloon-right">*/}
                                                                    <p>{e.message}</p>
                                                                </Typography>
                                                            </Grid>
                                                        </ListItemText>
                                                        <ListItemAvatar>
                                                            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" className={classes.avatar} />
                                                        </ListItemAvatar>
                                                    </Grid>
                                                </ListItem>
                                            )
                                        }
                                    })
                                )
                            }
                        }
                    })()}
                    </List>
                </div>
                {(() => {
                    if(this.state.log_exist) {
                        return(
                            <div className={classes.messageAreaWrap}>
                                 <Grid container className={classes.messageArea} alignItems="flex-end">
                                <Grid item xs={10} lg={10} md={10} sm={12}>
                                    <TextField
                                        id="outlined-multiline-static"
                                        multiline
                                        rows="1"
                                        className={classes.textField}
                                        variant="outlined"
                                        value={this.state.message}
                                        onChange={e => this.messageChanged(e)}
                                        fullWidth
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={e => this.send()}
                                                    >
                                                        <AccountCircle />
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={2} lg={2} md={2} sm={12}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className={classes.button}
                                        endIcon={<Icon>send</Icon>}
                                        onClick={e => this.send()}
                                    >
                                        送信
                                    </Button>
                                </Grid>
                            </Grid>
                            </div>
                        )
                    }
                })()}
            </div>

        )
    }
}
export default withStyles(styles, { withTheme: true })(ChatForm);
