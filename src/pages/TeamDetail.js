import React, { Component } from 'react';
import '../assets/scss/App.scss';
import {createMuiTheme, List, MuiThemeProvider, withStyles} from "@material-ui/core";
import classnames from 'classnames';

import {compose} from "redux";
import {connect} from "react-redux";
import PropTypes from "prop-types";

import red from '@material-ui/core/colors/red';
import Api from "~/src/util/apis";
import store from "../store";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {theme} from "../theme/theme";
import UpdateTeam from "../component/UpdateTeam";
import AppBar from "./SignIn";
import {mapDispatchToProps, mapStateToProps} from "../action";
import ReactMde from "react-mde";
import Showdown from "showdown";
import "react-mde/lib/styles/css/react-mde-all.css";
import xssFilter from 'showdown-xss-filter'
import Button from '@material-ui/core/Button';
import UserList from '../component/UserList'
import Entries from "../component/Entries";
import aa from '../../src/assets/css/MarkDownPreview.css'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Loading from '../component/Loading'
import Fade from '@material-ui/core/Fade';
import CircularProgress from "@material-ui/core/CircularProgress";
import Common from '../util/common'

const styles = theme => ({
    font:{
        fontColor:"#707070"
    },
    imageSrc: {
        backgroundSize: 'cover',
        // width:'100%',
        height:"300px",
        backgroundPosition: 'center 40%',
        padding:2
    },
    detail:{
        padding: 20
    },
    button:{
        padding: 10,
        fontWeight: 'bold',
        border: 'solid 2px black',
        color: '#FFFFFF',

    },
    border:{
        borderRight:"solid 1px #78909c",
    },
    headerBox:{
        paddingTop:10,
        paddingRight:20,
        paddingBottom:20,
        paddingLeft:20
    },
    contents:{
        marginTop:40,
        color:"#78909c",
        textAlign: 'center',
    },
    mdePreview:{
      minHeight: '40px!important'
    },
    introduction:{
        padding:20,
        minHeight:'40px!important '
    },
});
function typographyV1Theme(theme) {
    return createMuiTheme({
        ...theme,
        typography: {
            useNextVariants: false,
        },
    });
}

// https://github.com/andrerpena/react-mde/blob/master/src/components/MdePreview.tsx

class TeamDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            team_id:this.props.location.state.team.team_id,
            user_id:store.getState().user_id,
            team_detail: {
                info: {},
                member: {}
            },
            list_show_flg:false,
            md_show_flg:false,
            is_joined:false,
            is_owner:false,
            admin_user:false,
            display_loading:false,
            loading:false
        };
        this.converter = new Showdown.Converter({
            tables: true,
            simplifiedAutoLink: true,
            strikethrough: true,
            tasklists: true,
            extensions: [xssFilter],
        });

    }

    getImage = (url) => { return require(`${url}`) };
    handleExpandClick = () => {
        this.setState(state => ({ expanded: !this.state.expanded }));
    };
    componentDidMount = async()=> {
        this.setState({
            display_loading:true
        })

        let params = new URLSearchParams();
        params.set('team_id', this.state.team_id);
        params.set('user_id', this.state.user_id);

        let _this = this
        await Api.getTeamDetail(params).then(
            await function(response){
                console.log("detail:"+ JSON.stringify(response))
                _this.setState({
                    team_detail:{
                        info:response.detail.info[0],
                        member:response.detail.member
                    },
                    is_joined:response.detail.is_joined,
                    is_owner:response.detail.is_owner

                });
                if(_this.state.team_detail.info){
                    _this.setState({
                        list_show_flg:true
                    })
                }
                if(_this.state.team_detail.info.contents){
                    _this.setState({
                        md_show_flg:true
                    })
                }
            }
        )
        //ToDo
        //メンバー情報を取得
        //管理者

        await this.setState({
            display_loading:false
        })
    };
    setContents = async (contents) =>{
        await this.setState( {
            contents:contents
        });
    };
    join = async()=>{
        let _this = this
        let params = new URLSearchParams();
        params.set('team_id', this.state.team_id);
        params.set('user_id', this.state.user_id);

        await Api.teamJoin(params).then(
            await function(response) {

            }
        )
    };
    handleFollow = async () => {
        if (!this.state.loading) {
            await this.setState(
                {
                    success: false,
                    loading: true,
                },
                () => {
                    this.timer = setTimeout(() => {
                        this.setState({
                            loading: false,
                            success: true,
                            btn_disables: true,

                        });
                    }, 2000);
                },
            );
            this.follow().then(alert("成功"))

        }
    }
    setTeam = (team)=>{
        console.log("team:"+JSON.stringify(team))
        this.setState({team_detail:{
          info:team
        }})
        this.setState({
            md_show_flg:true
        })

        console.log(this.state.team_detail)
    }
    render() {
        const { classes} = this.props;
        const { loading, success, display_loading   } = this.state;

        if (display_loading) {
            return(
                <Fade in={this.state.display_loading}>
                    <Loading loading={this.state.display_loading}/>
                </Fade>
            )
        }

        return (
            <Grid container>
                <Fade in={!this.state.display_loading}>
                    <Grid item xs={12} sm={12} md={12} lg={12} id="entry">
                        <div className={classes.main}>
                            <div
                                className={classes.imageSrc}
                                style={{
                                    backgroundImage: `url("https://dol.ismcdn.jp/mwimgs/8/d/670m/img_8db0612c13c0013326bfb1b66431df95645897.jpg")`,
                                }}
                            >
                            </div>
                            <Grid container justify="center">
                                <Grid item xs={12} sm={12} md={11} lg={11} className={classes.detail}>
                                    <Grid container>
                                        <Grid xs={12} sm={12} md={11} lg={11} container justify="flex-start">
                                            <div gutterBottom variant="headline" color="inherit" component="h2" noWrap
                                                 className="main_title">
                                                <h2>{this.state.team_detail.info.name}</h2>
                                            </div>
                                        </Grid>
                                        <Grid xs={12} sm={12} md={1} lg={1} container justify="flex-end">
                                            {( () => {
                                            if (this.state.is_owner) {
                                                return (
                                                    <UpdateTeam team_detail={this.state.team_detail} setTeam={this.setTeam}/>
                                                )
                                            }
                                            if(!this.state.is_owner){
                                                if(!this.state.is_joined){
                                                    return(
                                                        <card>
                                                            <Button variant="contained" color="primary" className={classes.button}
                                                                    onClick={this.join}>
                                                                このチームに参加する
                                                            </Button>
                                                        </card>
                                                    )
                                                }
                                                if(this.state.is_joined) {
                                                    return (
                                                        <Button variant="contained" color="secondary" disabled
                                                                className={classes.button}>
                                                            参加中
                                                        </Button>
                                                    )
                                                }
                                            }
                                        })()}
                                        </Grid>
                                    </Grid>
                                    <div className="contents">
                                        <Grid container justify="center">
                                            <Grid item xs={12} sm={12} md={12} lg={12} align="left">
                                                <div gutterBottom variant="headline" color="inherit" component="h3" noWrap
                                                     className="main_title">
                                                    <h3 className={classes.introduction}>
                                                        {( () => {
                                                            if(this.state.team_detail.info.contents === ""){
                                                                return(
                                                                    <Grid container justify="center">
                                                                        <p>登録がありません</p>
                                                                    </Grid>
                                                                )
                                                            }　else {
                                                                return(
                                                                    <ReactMde
                                                                    value={this.state.team_detail.info.contents}
                                                                    generateMarkdownPreview={markdown =>
                                                                    Promise.resolve(this.converter.makeHtml(markdown))}
                                                                    selectedTab="preview"
                                                                    readOnly={true}
                                                                    // minEditorHeight={200}
                                                                />
                                                                )
                                                            }
                                                        })()}
                                                    </h3>
                                                </div>
                                            </Grid>
                                        </Grid>
                                    </div>
                                    <Grid container justify="center">
                                        <Grid item lg={12} xs={12}>
                                            <Grid container justify="center" className={classes.contents}>
                                                <Grid item　xs={4}　className={classes.border + ' '+ classes.headerBox}>
                                                    <p className="mb20">メンバー</p>
                                                    <p><span className="fs26">{this.state.team_detail.info.member_cnt}</span>&nbsp;&nbsp;人</p>
                                                </Grid>
                                                <Grid item　xs={4} className={classes.headerBox}　>
                                                    <p className="mb20">投稿数</p>
                                                    <p><span className="fs26">{this.state.team_detail.info.entry_cnt}</span>&nbsp;&nbsp;件</p>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Card class="card">
                                        <CardContent>
                                            <div className="contents">
                                                <Grid container justify="center">
                                                    <div gutterBottom variant="headline" color="inherit" component="h2" noWrap
                                                         className="main_title">
                                                        <h2>チームメンバー</h2>
                                                    </div>
                                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                                        <UserList type="team" team_id={this.state.team_id}/>
                                                    </Grid>
                                                </Grid>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card class="card">
                                       <CardContent>
                                        <div className="contents">
                                            <Grid container justify="center">
                                                <div gutterBottom variant="headline" color="inherit" component="h2" noWrap
                                                     className="main_title">
                                                    <h2>チームエントリ</h2>
                                                </div>
                                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                                    <Entries type="team"/>
                                                </Grid>
                                            </Grid>
                                        </div>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>

                        </div>
                        {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                    </Grid>
                </Fade>
            </Grid>
        );
    }
}
TeamDetail.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default compose(
    withStyles(styles),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(TeamDetail)