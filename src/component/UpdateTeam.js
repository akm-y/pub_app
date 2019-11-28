import React from 'react';
import store from "~/src/store";
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { mapStateToProps,mapDispatchToProps } from '../action.js';
import {compose} from "redux";
import {connect} from "react-redux";
import Api from "~/src/util/apis";
import { green, purple } from '@material-ui/core/colors';
import PostTeamDialog from '../component/PostTeamDialog'
import DialogActions from '@material-ui/core/DialogActions';
import SettingsIcon from "../component/MainHeader";
import MenuItem from '@material-ui/core/MenuItem';

const styles = theme => ({
    root: {
        marginTop:40,
        marginBottom: 40
    },
    contents:{
        paddingLeft:20
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
        marginTop:20
    },
    textField: {
        // marginLeft: theme.spacing.unit,
        // marginRight: theme.spacing.unit,
        // width:640,
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 140,
        display:'flex',
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
    tempButton: {
        margin: theme.spacing.unit,
        display:'flex',
        height: 40,
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
    row:{
        marginBottom:30
    },
    button:{
        padding: 10,
        fontWeight: 'bold',
        border: 'solid 2px black',
        color: '#FFFFFF',
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
class PostTeam extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            post_team_open: false,
            user_id: store.getState().user_id,
            friends: [],
            team: {
                team_id: "",
                name: '',
                category: '',
                admin_user_id: '',
                image_path:'aaaa.jpg',
                contents:'',
                member: {}
            },
            display_loading: true
        }
    };
    componentDidMount() {
        this.setState({
            team: {
                team_id:this.props.team_detail.info.team_id,
                name: this.props.team_detail.info.name,
                category: this.props.team_detail.info.category,
                image_path: this.props.team_detail.info.image_path,
                contents: this.props.team_detail.info.contents,
                member: this.props.team_detail.member,//足りない
            }
        });

    }

    //レンダリング直前
    postTeamOpen = () => {
        this.setState({ post_team_open: true });
    };
    postTeamClose = async () => {
        await this.setState({ post_team_open: false });
    };

    //アラート画面を閉じる
    popupClose = () => {
        this.setState({ draftSaveOpen: false });
        this.setState({post_team_open:false})
    };
    setValue= async (name,value) => {
        let team = this.state.team;
        team[name] = value;
        this.setState( {team:team});
        console.log("team:"+team)
    };

    //stateにコンテンツをセット
    setContents = async (contents) => {
        let team = this.state.team;
        team["contents"] = contents;
        await this.setState({team: team});
        console.log(this.state.team)
    };
    setMember = async (member) =>{
        await this.setState({
            member:member
        })
    };


    do_update = async () =>{
        return new Promise(async (resolve, reject) => {

            let _this = this
            let params = new URLSearchParams();
            params.set('team_id', this.state.team.team_id);
            params.set('user_id', store.getState().user_id);
            params.set('category', this.state.team.category);
            params.set('name', this.state.team.name);
            params.set('image_path', this.state.team.image_path);
            params.set('contents', this.state.team.contents);
            await Api.updateTeam(params).then(
                function (response) {
                    console.log("update:"+JSON.stringify(response))
                    _this.props.setTeam(_this.state.team)
                    _this.popupOpen()
                }
            );


            await window.setTimeout(() => {
                this.popupClose();
            }, 2000);

            resolve(true)
        });
    }

    clear(){
        alert("clear")
        this.setState({
            team: {
                name: '',
                category: '',
                admin_user_id: '',
                image_path:'',
                contents:'',
                member: {}
            },
            entry_id:''
        });
    }
    popupOpen = () => {
        this.setState({ draftSaveOpen: true });
    };

    render() {
        const { classes } = this.props;

        return (
            <div>
                <div onClick={this.postTeamOpen}>
                    {(() => {
                        if(this.props.menu === true){
                            return(
                                <MenuItem>
                                    <IconButton color="inherit">
                                        <SettingsIcon />
                                    </IconButton>
                                    <p>チームを作る</p>
                                </MenuItem>
                            )
                        } else {
                            return(
                                <Button variant="contained" color="primary" className={classes.button}>
                                    編集
                                </Button>
                            )
                        }
                    })()}
                </div>
                <Dialog
                    fullScreen
                    open={this.state.post_team_open}
                    onClose={this.postTeamClose}
                    TransitionComponent={Transition}
                >
                    <AppBar className={classes.appBar}>
                        <Toolbar className={classes.flex}>
                            <IconButton color="inherit" onClick={this.postTeamClose} aria-label="Close">
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="h6" color="inherit" >
                                編集
                            </Typography>
                            <Button color="inherit" onClick={() =>this.do_update()}>
                                保存
                            </Button>
                        </Toolbar>
                    </AppBar>
                    <PostTeamDialog setValue={this.setValue} setMember={this.setMember} setContents={this.setContents} team_detail={this.props.team_detail}/>
                </Dialog>
                <Dialog
                    open={this.state.draftSaveOpen}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <b>チーム情報を更新しました。<br />
                            前の画面に戻ります。</b>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.popupClose} color="primary" autoFocus>
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

PostTeam.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default compose(
    withStyles(styles),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(PostTeam)
