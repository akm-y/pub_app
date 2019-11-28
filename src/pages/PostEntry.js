import React from 'react';
import store from "~/src/store";
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import classNames from "classnames";
import FormControl from '@material-ui/core/FormControl';
import { mapStateToProps,mapDispatchToProps } from '../action.js';
import MarkDown from '../component/MarkDown'
import {compose} from "redux";
import {connect} from "react-redux";
import Api from "~/src/util/apis";
import Grid from '@material-ui/core/Grid';
import { green, purple } from '@material-ui/core/colors';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import DeleteDialog from '../component/DeleteDialog'
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import DialogActions from '@material-ui/core/DialogActions';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

const styles = theme => ({
    contents: {
        margin: '50px auto 0 ',
        width : 720,
    },
    appBar: {
        position: 'relative',
    },
    flex: {
        display:'flex',
        justifyContent:'space-between',
    },
    container: {
        display: 'flex',
        justifyContent:'space-between',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
    },
    textField: {
        // marginLeft: theme.spacing.unit,
        // marginRight: theme.spacing.unit,
        // width:640,
        width:'100%'
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 140,
        width:'100%',
        display:'flex',
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
    input: {
        display: 'none',
    },
    control: {
        padding: theme.spacing.unit * 2,
    },
    listRoot:{
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
        overflow: 'auto',
        maxHeight: 300,
        borderTop:'solid 2px #BCE0FD',
        borderRight:'solid 2px #BCE0FD',
        borderLeft:'solid 2px #BCE0FD',
        borderRadius:"4px",
        paddingBottom: '0px!important'
    },
    listItem:{
        borderBottom:'solid 2px #BCE0FD',
        padding:'0px!important',
        textAlign:'left'
    },
    draftListTitle:{
        textAlign:'left',
    },
    delete_icon: {
        textAlign:'center',
        color: "red",
        fontSize: 24,
        cursor: "pointer"
    },
});

function Transition(props) {
    return <Slide direction="up" {...props} />;
}
const ColorButton = withStyles(theme => ({
    root: {
        color: theme.palette.getContrastText(purple[500]),
        backgroundColor: purple[500],
        '&:hover': {
            backgroundColor: purple[700],
        },
    },
}))(Button);
class PostEntry extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            post_entry_open: false,
            draftSaveOpen: false,
            saveOpen: false,
            user_id: store.getState().user_id,
            entry_id:'',
            category:[
                {id:10,name:"ブログ"},
                {id:20,name:"質問"},
                {id:30,name:"募集"},
                {id:40,name:"広告"}//企業のみ　最初は非表示
            ],
            affiliation:[],
            entry: {
                category: [],
                title: '',
                contents: '',
                // post: {category: [], contents: ""},
                image_path: '',
                status: 2,　//とりあえず
                team_id: '',
                role: 1,　//2の場合はteam_idを設定しなければならない
            },
            draft_list: [],
            list_show_flg:false,
            draft_entry_title: ''
        }


    };
    //レンダリング直前
    componentWillMount= async ()=>{
        let params = new URLSearchParams();
        await params.set('user_id', this.state.user_id);
        let _this = this
        await Api.getBelongTeam(params).then(
            await function(response){
                _this.setState({
                    affiliation:response.team
                })

                if(_this.state.affiliation.length > 0){
                    _this.setState({
                        affiliation_show_flg:true
                    })
                }
                _this.setState({
                    display_loading:false,
                })

            }
        );

        //sotreに値がある場合はstateにつめる
        if (Object.keys(store.getState().entry).length === 0){
            //storeにpostオブジェクトがないときは何もしない
            return;
        }
        await Api.getDraftEntryList(params).then(
            function(response){
                _this.state.draft_list = response.draft

                if(_this.state.draft_list.length > 0){
                    _this.setState({
                        list_show_flg:true
                    })
                }
                _this.setState({
                    display_loading:false,
                })

            }
        );
        this.setState({entry: {
                //セット
                choice: ("choice" in store.getState().entry) ? store.getState().entry.choice : 99,
                contents: ("contents" in store.getState().entry) ? store.getState().entry.contents : "" ,
                title: ("title" in store.getState().entry) ? store.getState().entry.title : "",
                image_path: ("image_path" in store.getState().entry) ? store.getState().entry.image_path : "",
                role: ("role"in store.getState().entry) ? store.getState().entry.role : 1,
                status: ("status"in store.getState().entry) ? store.getState().entry.status : 2,
                team_id : ("team_id"in store.getState().entry) ? store.getState().entry.team_id : "",
            }
        });


    }
    handleClickOpen = () => {
        this.setState({ post_entry_open: true });
    };
    handleClose = async () => {
        await this.setState({ post_entry_open: false });
    };
    // register= async() => {
    //     let params = new URLSearchParams();
    //     params.set('user_id', this.state.user_id);
    //     params.set('content', JSON.stringify(this.state.entry));
    //     params.set('status', 3); //本投稿
    //     params.set('role', 1); //フルオープン
    //
    //     // for (let item in this.state.entry) {
    //     //     await params.set(item, this.s        tate.entry[item]);
    //     // }
    //     await console.log(params)
    //     await Api.postEntries(params).then(
    //     function(response){
    //         console.log(response)
    //     }
    //     );
    //     await this.setState({ open: false });
    // };

    tempBtnClickOpen = () => {
        this.setState({ draftSaveOpen: true });
    };

    //アラート画面を閉じる
    tempBtnClickClose = () => {
        this.setState({ draftSaveOpen: false });
    };
    saveBtnClickOpen = () => {
        this.setState({ saveOpen: true });
    };

    //アラート画面を閉じる
    saveBtnClickClose = () => {
        this.setState({ saveOpen: false });
    };
    //stateに選択したカテゴリをセット
    setChoice = async event => {
        let entry = this.state.entry;
        entry[event.target.name] = event.target.value;
        await this.setState( {
            entry:entry
        });
        await console.log(this.state.entry)
    };
    //stateに選択したカテゴリをセット
    //stateがリセットされるので持ち方を考える
    setTitle = async event => {
        let entry = this.state.entry;
        entry[event.target.name] = event.target.value;
        await this.setState( {
            entry:entry
        });
        await console.log(this.state.entry)
    };

    //stateにコンテンツをセット
    setContents = async (contents) =>{
        let entry = this.state.entry;
        entry['contents'] = contents
        await this.setState( {entry:entry
        });
        await console.log(this.state.entry)
    };
    saves = async(status) =>{
        if (this.state.entry_id === ''){
            //新規
            await this.do_save(status).then(
                (result) => {
                    this.clear()
                }).catch()
        } else {
            //更新
            await this.do_update(status).then(
                (result) => {
                    this.clear()
                }).catch()
        }
    };
    do_save = async (status) =>{
        return new Promise(async (resolve, reject) => {
            await this.setState({
                entry: {
                    category: this.state.entry.category,
                    contents: this.state.entry.contents,
                    title: this.state.entry.title,
                    team_id: this.state.entry.team_id,
                    role: this.state.entry.role,
                    choice: this.state.entry.choice,
                    status: this.state.entry.status,
                }
            });
            await console.log("1:" + JSON.stringify(this.state.entry.contents) === "")
            let params = new URLSearchParams();
            params.set('user_id', this.state.user_id);
            params.set('title', this.state.entry.title);
            params.set('choice', this.state.entry.choice);
            params.set('team_id', this.state.entry.team_id);
            params.set('contents', this.state.entry.contents);
            params.set('status', status); //本投稿
            params.set('role', 1); //フルオープン

            await Api.postEntries(params).then(
                function (response) {
                    console.log(response)
                }
            );

            await this.props.setEntry(this.state.entry)

            if(status===0){
                await this.tempBtnClickOpen()
                await window.setTimeout(() => {
                    this.tempBtnClickClose();
                }, 2000);
            }
            if(status===3){
                await this.saveBtnClickOpen()
                await window.setTimeout(() => {
                    this.saveBtnClickClose();
                }, 2000);
            }

        });
        resolve(true)
    };
    do_update = async (status) =>{
        return new Promise(async (resolve, reject) => {
            await this.setState({
                entry: {
                    category: this.state.entry.category,
                    contents: this.state.entry.contents,
                    title: this.state.entry.title,
                    team_id: this.state.entry.team_id,
                    role: this.state.entry.role,
                    choice: this.state.entry.choice,
                    status: this.state.entry.status,
                    team: this.state.entry.team
                }
            });


            let params = new URLSearchParams();
            params.set('entry_id', this.state.entry_id);
            params.set('user_id', this.state.user_id);
            params.set('content', JSON.stringify(this.state.entry));
            params.set('status', status); //本投稿
            params.set('role', 1); //フルオープン
            params.set('team_id', this.state.team_id);

            await Api.updateEntry(params).then(
                function (response) {
                    console.log(response)
                }
            );

            await this.props.setEntry(this.state.entry)

            await this.tempBtnClickOpen()
            await window.setTimeout(() => {
                this.tempBtnClickClose();
            }, 2000);

            resolve(true)
        });
    }

    select_draft (val){
        this.setState({
            entry:{
                choice: val.category === undefined ? "":val.category,
                title: val.title === undefined ? "":val.title,
                contents: val.contents === undefined ? "":val.contents,
                team_id: val.team_id === undefined ? "":val.team_id,

            },
            entry_id:val.entry_id
        });
        console.log(val.title)
    };
    delete_draft = async(val) =>{
        let params = new URLSearchParams();
        params.set('user_id', this.state.user_id);
        params.set('entry_id', val.entry_id);

        await Api.deleteEntries(params).then(
            function(response){
                console.log(response)
            }
        );
        let filteredArray =await this.state.draft_list.filter(
            function( element, index, array ){
                return (element.entry_id && element.entry_id !== val.entry_id );
            });
        this.setState({
            draft_list:filteredArray
        })
        await alert("下書きを削除しました。")
    };
    clear(){
        alert("clear")
        this.setState({
            entry:{
                category:'',
                contents:'',
                title:'',
                team_id: '',
                role:'',
                choice:'',
                status:'',
            },
            entry_id:''
        });
        return
    }

    render() {

        const { classes } = this.props;
        let _this = this
        return (
                <div gutterBottom variant="headline" color="inherit" component="h2" noWrap className="main_title">
                   <div onClick={this.handleClickOpen}>
                        <Fab color="primary" aria-label="add" className={classes.margin}>
                            <AddIcon fontSize="large" />
                        </Fab>
                   </div>
                    <Dialog
                        fullScreen
                        open={this.state.post_entry_open}
                        onClose={this.handleClose}
                        TransitionComponent={Transition}
                    >
                    <AppBar className={classes.appBar}>
                        <Toolbar className={classes.flex}>
                            <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="h6" color="inherit" >
                                投稿を作成
                            </Typography>
                            <Button color="inherit" onClick={() =>this.saves(3)}>
                                投稿
                            </Button>
                        </Toolbar>
                    </AppBar>
                        <Grid container justify="center">
                            <Grid item xs={11} sm={11} md={8} lg={8}>
                            <Card class="card">
                            <CardContent>
                                <main className={classNames()}>
                                    <Grid container justify="center">
                                        <Grid item xs={11} sm={11} md={11} lg={11} container justify="center" >
                                           <Grid item xs={6} sm={6} md={6} lg={6} container justify="flex-start">
                                                <FormControl required　className={classes.formControl}>
                                                    <TextField
                                                        id="outlined-select-currency-native"
                                                        select
                                                        label="投稿の種類"
                                                        className={classes.textField}
                                                        value={this.state.entry.choice}
                                                        name="choice"
                                                        onChange={this.setChoice}
                                                        SelectProps={{
                                                            native: true,
                                                            MenuProps: {
                                                                className: classes.menu,
                                                            },
                                                        }}
                                                        // helperText="選択してください"
                                                        margin="normal"
                                                        variant="outlined"
                                                    >
                                                        <option key={99} value={99}>選択してください</option>
                                                        {this.state.category.map((category)=>
                                                            <option key={category.id} value={category.id}>{category.name}</option>
                                                        )}
                                                    </TextField>
                                                    <TextField
                                                    required
                                                    id="outlined-required"
                                                    label="タイトル"
                                                    name="title"
                                                    value={this.state.entry.title}
                                                    className={classes.textField}
                                                    margin="normal"
                                                    variant="outlined"
                                                    onChange={this.setTitle}
                                                    />
                                                    <TextField
                                                        id="outlined-select-currency-native"
                                                        select
                                                        label="投稿先"
                                                        className={classes.textField}
                                                        value={this.state.entry.team_id}
                                                        name="team_id"
                                                        onChange={this.setChoice}
                                                        SelectProps={{
                                                            native: true,
                                                            MenuProps: {
                                                                className: classes.menu,
                                                            },
                                                        }}
                                                        // helperText="選択してください"
                                                        margin="normal"
                                                        variant="outlined"
                                                    >
                                                        <option key={99} value={99}>指定なし</option>
                                                        {this.state.affiliation.map((team)=>
                                                            <option key={team.id} value={team.id}>{team.name}</option>
                                                        )}
                                                    </TextField>
                                                </FormControl>
                                            </Grid>
                                            {this.state.list_show_flg &&
                                                <Grid item xs={6} sm={6} md={6} lg={6}>
                                                <Grid container justify="flex-end">
                                                    <span>{`下書きリスト`}</span>
                                                    <List className={classes.listRoot} subheader={<li />}>
                                                        {this.state.draft_list.map((entry)=>
                                                         <ListItem className={classes.listItem} >
                                                                <Button fullWidth onClick={() =>_this.select_draft(entry)}>
                                                                <Avatar>
                                                                    <ImageIcon />
                                                                </Avatar>
                                                                    {(() => {
                                                                        let title = ""
                                                                        if(entry.title !== undefined){
                                                                            title = entry.title
                                                                            if(title.length >= 10){
                                                                                title= title.slice(0,10) + '...'
                                                                            }
                                                                        }
                                                                        return(
                                                                            <ListItemText primary={<p style={{textAlign: "left"}}>{title}</p>}
                                                                                          secondary={<p style={{textAlign: "left"}}>{new Date(entry.create_dt).toLocaleString().slice(0, -3)}</p>} />
                                                                        )
                                                                    })()}
                                                                </Button>
                                                                <DeleteDialog delete={() =>_this.delete_draft(entry)} />
                                                                {/*<span fullWidth onClick={() =>_this.delete_draft(entry)}>*/}
                                                                {/*   <DeleteForeverIcon className={classes.delete_icon} />*/}
                                                                {/*</span>*/}
                                                            </ListItem>
                                                        )}
                                                    </List>
                                                </Grid>
                                            </Grid>
                                            }
                                        </Grid>
                                        <Grid item xs={11} sm={11} md={11} lg={11} className={classes.root}>
                                            <MarkDown choice={this.state.entry.choice} contents={this.state.entry.contents} setValue={this.setContents.bind(this)}/>
                                        </Grid>
                                         <Grid container justify="flex-end" alignItems="right" alignContent="right">
                                            <Grid item lg={2}>
                                                <Button variant="contained" color="primary" className={classes.button}
                                                        onClick={() =>this.saves(0)}>
                                                    一時保存
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </main>
                            </CardContent>
                        </Card>
                        </Grid>
                        </Grid>
                    </Dialog>
                        <Dialog
                        open={this.state.draftSaveOpen}
                        onClose={this.tempBtnClickClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        >
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                <b>投稿の内容を一時保存しました。<br />
                                一時保存された内容は投稿すると削除されます。</b>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.tempBtnClickClose} color="primary" autoFocus>
                                OK
                            </Button>
                        </DialogActions>
                        </Dialog>
                    <Dialog
                    open={this.state.saveOpen}
                    onClose={this.saveBtnClickClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    >
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <b>投稿の内容を保存しました。<br />
                                前の画面に戻ります。</b>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.saveBtnClickClose} color="primary" autoFocus>
                            OK
                        </Button>
                    </DialogActions>
                    </Dialog>
                </div>
        );
    }
}

PostEntry.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default compose(
    withStyles(styles),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(PostEntry)
