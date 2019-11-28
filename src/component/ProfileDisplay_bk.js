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
        // marginBottom:"5px",
        // padding:"10px"
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

class ProfileDisplay_bk extends React.Component {
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
        this.setState({
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

        //外套のユーザ情報を取得
        await this.getUserInfo()

        //友達ステータスを取得（本人以外のコンポーネントで使用するとき）
        if(this.state.other_flg) {
            await this.getFriendStatus()
        }

        await this.setState({
            //display_loading:false
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
    handleChangeSelectList = async event =>{
        let name = event.target.name
        let value = event.target.value
        this.setState({ [name]: value });
        await this.setStore(name, value)

    };
    handleChange = async event => {
        let name = event.target.name
        let value = event.target.value

        this.setState({
            [name]: value,
        });

        await this.setStore(name, value)
    };
    handleChangeJpbStatus = async event => {
        let name = event.target.name
        let value = !this.state.job_status
        this.setState({ [name]: value });
        await this.setStore(name, value)
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
                        <Grid item xs={1} sm={1} md={3} >経歴{val.id}</Grid>
                        <Grid item xs={5} sm={5} md={5} >{(val.start)?val.start:""} ~ {(val.end)?val.end:""}</Grid>
                    </Grid>
                </Grid>
                <Grid item container xs={12} sm={12} md={12} lg={12} justify="flex-start">
                    <Grid container alignItems="flex-start" spacing={1}>
                        <Grid item xs={1} sm={1} md={3} >勤務先</Grid>
                        <Grid item xs={5} sm={5} md={5} >{val.company}</Grid>
                    </Grid>
                </Grid>
                <Grid item container xs={12} sm={12} md={12} lg={12} justify="flex-start">
                    <Grid container alignItems="flex-start" spacing={1}>
                        <Grid item xs={1} sm={1} md={3} >職種</Grid>
                        <Grid item xs={5} sm={5} md={5} >{val.job}</Grid>
                    </Grid>
                </Grid>
                <Grid item container xs={12} sm={12} md={12} lg={12} justify="flex-start">
                    <Grid container alignItems="flex-start" spacing={1}>
                        <Grid item xs={1} sm={1} md={3} >ポジション</Grid>
                        <Grid item xs={5} sm={5} md={5} >{val.position}</Grid>
                    </Grid>
                </Grid>

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
        )
    }
    /////友達申請/////
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
                            follow_status:'友達申請中'

                        });
                    }, 2000);
                },
            );
            this.follow().then(alert("成功"))

        }
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
            //display_loading:false
        })

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
                            follow_status:'友達申請中'

                        });
                    }, 2000);
                },
            );
            this.follow().then(alert("成功"))

        }
    }

    //申請ボタン実行
    handleApproval = async () =>{
        await this.handleLoading()
        await this.approval().then(alert("成功"))
    }

    /////友達申請/////
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
        const { loading, success, display_loading   } = this.state;
        const buttonClassname = classNames({
            [classes.buttonSuccess]: success,
        });
        // if (loading) {
        //     return <CircularProgress  ariant="determinate" value={this.state.completed} size={24} className={classes.display_loading} />
        // }

        let imgUrl = "https://t.pimg.jp/054/346/450/1/54346450.jpg";
        let divStyle = {
            backgroundImage: 'url(' + imgUrl + ')',
            width:150,
            height:150,
        }
        // if (display_loading) {
        //     return(
        //         <Fade in={this.state.display_loading}>
        //             <Loading loading={this.state.display_loading}/>
        //         </Fade>
        //     )
        // }

        return (
            <Grid container>
                <Fade in={!this.state.loading}>
                    <Grid item xs={12} md={12} sm={12} lg={12}>
                        <Card class="card">
                            <CardContent>
                                <span className="box-title">プロフィール</span>
                                <Grid container justify="center" className={classes.basic_info}>
                                    <Grid item xs={12} sm={12} md={12} lg={12} container>
                                        <Grid className={classes.gridItem} container>
                                            <div style={divStyle} className={classes.myPhoto}></div>
                                            <Box>
                                                <Box fontSize={18}>
                                                    <Grid container>
                                                        {this.state.basic_info.first_name + this.state.basic_info.last_name}
                                                    </Grid>
                                                </Box>
                                                <Grid container>
                                                    <Box fontSize={12}>
                                                        <span>{this.state.basic_info.job}</span>
                                                    </Box>
                                                </Grid>
                                                <Grid container>
                                                    <Box fontSize={12}>
                                                        {this.state.basic_info.prefecture}　在住
                                                    </Box>
                                                </Grid>
                                                <Grid container>
                                                    <Box fontSize={12}>
                                                        <div>

                                                            {(() => {
                                                                if(this.state.basic_info.job_status){
                                                                    return <span>転職活動中</span>
                                                                }　else {
                                                                    return <span>転職の意思なし</span>
                                                                }

                                                            })()}
                                                        </div>
                                                    </Box>
                                                </Grid>

                                                <div>
                                                    {( () => {
                                                        if(this.state.other_flg === 1) {
                                                            if (this.state.request_flg || this.state.followed_flg) {
                                                                return (
                                                                    <Button
                                                                        className={classes.follow_icon}
                                                                        variant="outlined"
                                                                        color="green"
                                                                        disabled={true}
                                                                    >
                                                                        {this.state.follow_status}
                                                                    </Button>
                                                                )
                                                            } else if (this.state.friend_flg) {
                                                                return (
                                                                    <Button
                                                                        variant="outlined"
                                                                        disabled={true}
                                                                    >
                                                                        <SvgIcon className={classes.follow_icon}>
                                                                            <path
                                                                                d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z"/>
                                                                            {this.state.follow_status}
                                                                        </SvgIcon>
                                                                    </Button>
                                                                )
                                                            } else if (this.state.requested_flg) {
                                                                return (
                                                                    <Button
                                                                        variant="outlined"
                                                                        color="primary"
                                                                        className={buttonClassname}

                                                                        disabled={loading}
                                                                        onClick={this.handleApproval}
                                                                    >
                                                                        {this.state.follow_status}
                                                                    </Button>
                                                                )
                                                            } else {
                                                                return (
                                                                    <Button
                                                                        variant="outlined"
                                                                        color="primary"
                                                                        className={buttonClassname}

                                                                        disabled={this.state.btn_disables}
                                                                        onClick={this.handleFollow}
                                                                    >
                                                                        <AccessibilityNewRoundedIcon/>
                                                                        {this.state.follow_status}
                                                                    </Button>
                                                                )
                                                            }
                                                        }
                                                    })()}
                                                    {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                                                </div>

                                            </Box>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                        <Grid container alignItems="center" justify="flex-start" className={classes.borderBottom}>
                                            <DescriptionTwoToneIcon className={classes.icons}/>自己紹介
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={11} lg={12} justify="flex-start">
                                        <Box style={{padding:10,textAlign:"left"}}>
                                            {this.state.basic_info.memo}
                                        </Box>
                                    </Grid>
                                </Grid>
                                {( () => {
                                    if (this.state.other_flg === 0) {
                                        return(
                                            <Grid item xs={12} md={12} sm={12} lg={12}>
                                                <Grid container spacing={16} direction="row"
                                                      justify="flex-end"
                                                      alignItems="center"
                                                      className={classes.list}
                                                >
                                                    <ProfileDialog editType={"basic"}/>
                                                </Grid>
                                            </Grid>
                                        )
                                    }
                                })()}

                                </CardContent>
                        </Card>
                        <Card class="card">
                             <CardContent>
                                <span className="box-title">これまでの経験</span>
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
                                                    <Grid container justify="flex-end" alignItems="right" alignContent="right">
                                                        <Grid item lg={2}>
                                                            <CarrerDialog editType={"skill"}/>
                                                        </Grid>
                                                    </Grid>

                                                )
                                            }
                                        })()}

                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Fade>
            </Grid>
        );

    }}

ProfileDisplay_bk.propTypes = {
    classes: PropTypes.object.isRequired,
};
 // export default withStyles(styles)(InputProfile);
export default compose(
    withStyles(styles,{ withTheme: true }),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(ProfileDisplay_bk)