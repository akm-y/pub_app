import React from 'react';
import PropTypes from 'prop-types';
import { withStyles,createMuiTheme,MuiThemeProvider} from '@material-ui/core/styles';
import { connect } from "react-redux"
import { mapStateToProps,mapDispatchToProps } from '../action.js';
import { compose } from 'redux'
import store from '../store'
import common from '../util/common'

import Grid from '@material-ui/core/Grid';
import green from '@material-ui/core/colors/green';
import ProfileDialog from '~/src/component/ProfileDialog'
import CarrerDialog from '~/src/component/CarrerDialog'

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import DescriptionTwoToneIcon from '@material-ui/icons/DescriptionTwoTone';
import Box from '@material-ui/core/Box';
import Api from "../util/apis";
import Loading from '../component/Loading'
import Fade from '@material-ui/core/Fade';
import Button from "@material-ui/core/Button";
import SvgIcon from "@material-ui/core/SvgIcon/SvgIcon";
import CircularProgress from "@material-ui/core/CircularProgress";
import classNames from "classnames";
import AccessibilityNewRoundedIcon from '@material-ui/icons/AccessibilityNewRounded';

const styles = theme => ({
    root: {
        color: green[600],
        '&$checked': {
            color: green[500],
        },
    },
    icons:{
        // color: green[600],
        '&$checked': {
            color: green[500],
        },
        backgroundColor:"white",
        // border:"solid 1px",
        // borderRadius: "50%",
        padding: 4,
        width: 30,
        height: 30,
        marginRight: 5
    },
    basic_info:{
        margin:'20px 0'
    },
    checked: {},
    contents: {
        margin: '150px auto 0 ',
        maxWidth : '1260px',
    },
    formContents:{
        margin: '0 auto',
        maxWidth: '640px'
    },
    formControl:{
        display:'block',
        width:'100%'
    },
    chip: {
        margin: theme.spacing.unit / 4,
    },
    myClass: {
        width: '100% !important'
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    job_btn:{
        backgroundColor:"#008000!important",
        color:"#ffffff"
    },
    work_style_btn:{
        backgroundColor:"#4169e1!important",
        color:"#ffffff"
    },
    work_category_btn:{
        backgroundColor:"#9932cc!important",
        color:"#ffffff"
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    career: {
        marginBottom: "40px"
    },
    list:{
        marginTop:"5px",
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    pos: {
        marginBottom: 12,
    },
    bigAvatar: {
        margin: 10,
        width: 80,
        height: 80,
    },
    iconCamera:{
        color:'lightblue',
        position:'relative; top:25px; right:25px;'
    },
    gridItem: {
        justifyContent: 'center',
    },
    [theme.breakpoints.up('sm')]: {
        gridItem: {
            justifyContent: 'flex-start',
        }
    },
    [theme.breakpoints.down('sm')]: {
        gridItem: {
            justifyContent: 'center',
        },
    },
    myPhoto:{
        margin: '0 20px 20px 0'
    },
        borderBottom:{
        borderBottom:'solid 1px',
    },
    follow_icon: {
        color: green[500],
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

class ProfileDisplay extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            other_flg:(this.props.target_user_id === store.getState().user_id)? 0 : 1,  //　該当者が他人:1　自分:0
            user_id:this.props.target_user_id, //　表示対象のユーザID
            profile:{},
            basic_info:{},　//　表示対象のユーザ基本情報
            career:[],　//　表示対象の経歴情報
            careerId:1,　
            maxWidth: 'md',
            loading:false, // 申請ボタンのローディング
            display_loading:false, //画面全体のローディング
            follow_status:"友達申請する",　//　友達ステータス初期値
            followed_flg:false,
            request_flg:false,
            requested_flg:false,
            friend_flg:false,
            errors:"",
            btn_show:false,
            completed: 0,
            btn_disables:false,
            location: {
                search: window.location.search
            },



        }
    }
    componentDidMount= async()=> {
        await this.setState({
            display_loading:true
        })

        if (this.state.career.length >= 1){
            //経歴追加用のIDを管理する
            //現在のIＤを取得
            let tempIdList = [];
            this.state.career.map((data) => {
                tempIdList.push(data.id)
            });
            let maxId = Math.max.apply(null, tempIdList)
            this.setState({
                careerId:maxId
            })
        } else {
            await this.setState({
                career:[{id:this.state.careerId, start:"2019-01-01", end:"2019-01-01", text:""}]
            })
            await this.setStore("career", this.state.career)
        }

        //該当のユーザ情報を取得
        await this.getUserInfo()

        await this.setState({
            display_loading:false
        })
    };
    getUserInfo = async () =>{
        let params = new URLSearchParams();
        params.set('user_id', this.state.user_id);
        let _this = this
        await Api.getUser(params).then(
            function(response){
                _this.setState({
                    basic_info:response.user.profile.basic_info,
                    career:response.user.profile.career
                });
            }
        );
        await this.setStore("basic_info", this.state.basic_info)
        await this.setStore("career", this.state.career)
    }

    getStyles(name, that){
        return {
            fontWeight:
                that.state.work_category.indexOf(name) === -1
                    ? that.props.theme.typography.fontWeightRegular
                    : that.props.theme.typography.fontWeightMedium,
        };
    };

    setStore = async (name, value) =>{
        const cloneProfile = Object.assign({},store.getState().profile);
        cloneProfile[name] = value;
        await console.log("cloneProfile:"+JSON.stringify(cloneProfile[name]))

        //stateにセット
        await this.setState(
            {"profile":cloneProfile}
        );
        //stateをstoreに保存
        await this.props.setProfile(cloneProfile)
    }
    addRow = async() =>{
        await this.careerIdCountUp();

        await this.setState((prevState) => ({
            career: ((prevState) => {
                if (!prevState.career) {
                    prevState.career = []
                }
                prevState.career.push({ id: this.state.careerId, start: '' })
                return prevState.career
            })(prevState)
        }))
    }
    careerIdCountUp = async()=>{
        let next = this.state.careerId + 1
        await this.setState({
            careerId:next
        })
    }
    CareerForm(val, key) {
        const { classes } = this.props;
        return(
            <Grid container justify="center" className={classes.career} key={key}>
                <Grid item xs={12} sm={12} md={12} lg={12} container justify="flex-start">
                    <Grid container alignItems="flex-start" spacing={1}>
                        <Grid item xs={3} sm={3} md={3} >経歴{val.id}</Grid>
                        <Grid item xs={9} sm={9} md={9} >{(val.start)?val.start:""} ~ {(val.end)?val.end:""}</Grid>
                    </Grid>
                </Grid>
                <Grid item container xs={12} sm={12} md={12} lg={12} justify="flex-start">
                    <Grid container alignItems="flex-start" spacing={1}>
                        <Grid item xs={3} sm={3} md={3} >勤務先</Grid>
                        <Grid item xs={9} sm={9} md={9} >{val.company}</Grid>
                    </Grid>
                </Grid>
                <Grid item container xs={12} sm={12} md={12} lg={12} justify="flex-start">
                    <Grid container alignItems="flex-start" spacing={1}>
                        <Grid item xs={3} sm={3} md={3} >職種</Grid>
                        <Grid item xs={9} sm={9} md={9} >{val.job}</Grid>
                    </Grid>
                </Grid>
                <Grid item container xs={12} sm={12} md={12} lg={12} justify="flex-start">
                    <Grid container alignItems="flex-start" spacing={1}>
                        <Grid item xs={3} sm={3} md={3} >ポジション</Grid>
                        <Grid item xs={9} sm={9} md={9} >{val.position}</Grid>
                    </Grid>
                </Grid>
                <Grid item container xs={12} sm={12} md={12} lg={12} justify="flex-start">
                    <Grid container alignItems="flex-start" spacing={1}>
                        <Grid item xs={12} sm={12} md={12} >詳細</Grid>
                        <Grid item container xs={12} sm={12} md={12} lg={12} justify="flex-start">
                        <Typography
                            color="textSecondary"
                            gutterBottom
                            label={"詳細"}
                            defaultValue={val.text}
                            className={classes.textField}
                            variant="outlined"
                        >
                            {val.text}
                        </Typography>
                    </Grid>
                    </Grid>
                </Grid>
            </Grid>
        )
    }
    handleLoading = async ()=>{
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
                            success: true
                        });
                    }, 2000);
                },
            );
        }

    }

    goError = async (e) => {
        if(e.status === 710){
            this.setState({
                request_flg:true,
                follow_status:'友達申請中'
            })
        }
        await this.setState(
            {errors: (e.message || JSON.stringify(e))}
        )
    };
    getFriendStatus = async () =>{
        let params = new URLSearchParams();
        params.set('request_user_id', store.getState().user_id);
        params.set('follower_user_id', this.state.user_id);
        let _this = this;

        //取得した友達ステータスに応じてボタンの表示を切り替える
        await Api.getFriendStatus(params).then(
            function(response) {
                console.log(response)
                if(response.status === 200){
                    _this.setState({
                        friend_flg:false,
                        request_flg:false,
                        requested_flg:false,

                    })
                }
                if(response.status === 700){
                    _this.setState({
                        friend_flg:true,
                        follow_status:'友達'
                    })
                }
                console.log(response.status)
                if(response.status === 710){
                    _this.setState({
                        request_flg:true,
                        follow_status:'友達申請中'
                    })
                }
                console.log(response.status)
                if(response.status === 711){
                    _this.setState({
                        requested_flg:true,
                        follow_status:'友達申請を承認する'
                    })
                }
            }
        );
        await this.setState({
            display_loading:false
        })

    };

    render() {
        const { classes,dispatchAddValue } = this.props;
        // const ITEM_HEIGHT = 48;
        // const ITEM_PADDING_TOP = 8;
        // const MenuProps = {
        //     PaperProps: {
        //         style: {
        //             maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        //             width: 250,
        //         },
        //     },
        // };
        const {  success, display_loading   } = this.state;

        let imgUrl = "https://t.pimg.jp/054/346/450/1/54346450.jpg";
        let divStyle = {
            backgroundImage: 'url(' + imgUrl + ')',
            width:150,
            height:150,
        }
        if (display_loading) {
            return(
            <Fade in={this.state.display_loading}>
                <Loading loading={this.state.display_loading}/>
            </Fade>
            )
        }

        return (
            <Fade in={!this.state.display_loading}>
                <Grid container justify="center" alignItems="center">
                    <div gutterBottom variant="headline" color="inherit" component="h2" noWrap
                         className="main_title">
                        <h2>これまでの経験</h2>
                    </div>
                    <Grid container justify="center">
                        <Grid item xs={12} sm={12} md={12} lg={12}
                              justify="center"
                              alignItems="center"
                              className={classes.list}
                        >
                            {this.state.career && this.state.career.map(
                                (val,key) =>
                                    this.CareerForm(val, key)
                            )}
                        </Grid>

                            {( () => {
                                if (this.state.other_flg === 0) {
                                    return(
                                        <Grid container direction="row"
                                            justify="flex-end"
                                            alignItems="center"
                                            className={classes.list}
                                        >
                                            <Grid item xs={12} sm={12} md={4} lg={3}>
                                                <CarrerDialog editType={"skill"}/>
                                            </Grid>
                                        </Grid>
                                    )
                                }
                            })()}

                    </Grid>
                </Grid>
            </Fade>
        );

    }}

ProfileDisplay.propTypes = {
    classes: PropTypes.object.isRequired,
};
 // export default withStyles(styles)(InputProfile);
export default compose(
    withStyles(styles,{ withTheme: true }),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(ProfileDisplay)