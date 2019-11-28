import PropTypes from 'prop-types';
import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import { Route , withRouter} from 'react-router-dom'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

import classNames from "classnames";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Radio from '@material-ui/core/Radio';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import {compose} from "redux";
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps} from "../action";
import green from '@material-ui/core/colors/green';
import Api from "~/src/util/apis";
import Common from "../util/common";
import store from "../store";
import Grid from '@material-ui/core/Grid';
import Swiper from 'react-id-swiper';
import MySwiper from '../component/swiper';
import Loading from '../component/Loading'
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/core/SvgIcon/SvgIcon";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from '@material-ui/core/Typography';
import Fade from "./ProfileDisplayBasic";
const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        backgroundColor: theme.palette.background.paper,
        borderRadius: '1em',
    },
    inline: {
        display: 'inline',
    },
    link:{
        textDecoration: 'none',
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    green: {
        color: green[400],
        '&$checked': {
            color: green[600],
        },
    },
    search:{
        padding: 8,
        borderBottom: 'solid 1px lightgray',
        // borderRadius: '0.5em',
        width:'100%',
        outline:0
    },
    avatar: {
        margin:"0 auto"
    },
    itemList:{
        textAlign: 'center',
        paddingTop:20,
        paddingBottom:20,
    },
    contents:{
        marginTop:30,
        color:"#90a4ae",
        textAlign: 'center',
    },

    // contents:{
    //     marginTop:40,
    //     color:"#78909c",
    //     textAlign: 'center',
    // },

    bigAvatar: {
        // marginRight: 40,
        // marginLeft: 40,
        marginBottom: 20,
        width: 120,
        height: 120,
        margin:"0 auto"

    },
    name: {
        color:"#000"

    },
    prof:{
        fontSize:"0.7em",
        color:"#000"
    },
    checked: {},
    user:{
        width:150,
        height:200
    }
});

class UserList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedValue: ['a'],
            items:this.props.friendList,
            isRadioBtn:false,
            initialItem:this.props.friendList,
            list_show_flg: false,
            display_loading:false,
            target_user_id:this.props.user_id,
            title:''
        };
        this.setState({
            display_loading:true
        })

    };
    componentDidMount = async () => {
        if (window.innerWidth >= 960){
            await this.setState({
                spacing:24
            })
        } else {
            this.setState({
                spacing:0
            })
        }

        await this.getList(this.state.target_user_id)

        //友達リストにラジオボタンを持たせる
        this.setState({isRadioBtn:(this.props.type === "radio")});

        await this.setState({items: this.state.initialItem})

        // await this.setState({display_loading:false})

    };

    //val= user_id
    getList = async (val) =>{
        let _this = this

        _this.state.friends = store.getState().friends
        let params = new URLSearchParams();
        params.set('user_id', store.getState().user_id);

        //チームメンバー
        if(this.props.type ==='team'){
            this.setState({
                title:'メンバー'
            })

            params.set('team_id', this.props.team_id);

            await Api.getTeamMember(params).then(
                function(response){
                    _this.setState({
                        initialItem:response.members,
                        items:response.members
                    });
                    if(_this.state.items.length > 0){
                        _this.setState({
                            list_show_flg:true
                        })
                    }
                }
            );
        }
        //おすすめユーザ
        if(this.props.type === 'recommend'){
            this.setState({
                title:'おすすめのユーザ'
            })
            await Api.getUserList(params).then(
                function(response){
                    _this.setState({
                        initialItem:response.friends,
                        items:response.friends
                    });
                    if(_this.state.items.length > 0){
                        _this.setState({
                            list_show_flg:true
                        })
                    }
                }
            );
        }

        //自分の友達
        if(this.props.type === 'friend'){
            await Api.getUserList(params).then(
                function(response){
                    _this.setState({
                        initialItem:response.friends,
                        items:response.friends
                    });
                    if(_this.state.items.length > 0){
                        _this.setState({
                            list_show_flg:true
                        })
                    }
                }
            );
        }
    }

    //クリックした友達のIDを受け取って何かする
    friendSelected = async val =>{
        //ユーザの詳細画面へ遷移
        try{
            // const params = new URLSearchParams(location.search);
            // params.set('cd', val);
            await this.props.history.push({
                pathname: '/friend/detail/'+val,
                // search:params.toString(),
                state:{
                    user_id:val,
                    for:'friendAccount'
                }
            })
        } catch (e){
            this.goError(e)
        }
    };
    filterList = async(e) => {
        const updateList = this.state.initialItem.filter((item) => {
            console.log(item.profile.basic_info.first_name)
            return (item.profile.basic_info.first_name.toLowerCase().search( e.target.value.toLowerCase()) !== -1 ||
                item.profile.basic_info.last_name.toLowerCase().search( e.target.value.toLowerCase()) !== -1);
        });
        await this.setState({items: updateList})
    };
    goError = async (e) => {
        await this.setState(
            {errors: (e.message || JSON.stringify(e))}
        )
        await console.log("エラー:"+this.state.errors)
    };
    goFriendMore = async(val)=>{
        try{
            await this.props.history.push({
                pathname: '/friend/more',
            })
        } catch (e){
            this.goError(e)
        }
    };

    render() {
        const { classes } = this.props;

        const { display_loading } = this.state;
        const loading_style ={
            height:'200px',
            marginTop:'200px',
        }

        const params = {
            slidesPerView: 5,
            spaceBetween: 30,
            type: 'bullets',
            freeMode: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            renderPrevButton: () => <button  onClick={goPrev} className="swiper-button-prev"></button>,
            renderNextButton: () => <button onClick={goNext} className="swiper-button-next"></button>,
        };
        if (display_loading) {
            return(
                <Fade in={this.state.display_loading}>
                    <Loading loading={this.state.display_loading}/>
                </Fade>
            )
        }
        return (

            <div>
                <CardContent>
                    <Grid container className={classes.root} justify="center" alignItems="center">
                    <Grid item xs={12} lg={12}>
                        <Grid container justify="center" alignItems="center" className={classes.itemList}>
                            {(this.state.list_show_flg)?
                            this.state.items.map(function (value, id) {
                                // console.log(JSON.parse(value.profile).basic_info.first_name)
                                return (
                                    <Grid item lg={2} key={id} className={classes.user} onClick={()=>this.friendSelected(value.user_id)}>
                                        <Grid container className={classes.root} justify="center" alignItems="center">
                                            <Grid item lg={12} className={classes.avatar}>
                                                <Avatar alt="Remy Sharp" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7y2ebQyL17EfrE3mkCyOrhwY60w1z2kFe9_u9_TaGc3usyaPM" className={classes.bigAvatar}/>
                                            </Grid>
                                            <Grid item lg={12} >
                                                <p className={classes.name}>{value.profile.basic_info.first_name}　{value.profile.basic_info.last_name}</p>
                                                <p className={classes.prof}>{value.profile.basic_info.job}</p>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                );
                            }, this):
                                <Grid container justify="center">
                                    <p>メンバーがいません</p>
                                </Grid>
                            }
                        </Grid>
                    </Grid>
                </Grid>
                     {this.state.list_show_flg &&
                        <Grid container justify="flex-end" alignItems="right" alignContent="right">
                        <Grid item lg={2}>
                            <Button variant="contained" color="primary" className={classes.button}
                                    onClick={() => this.goFriendMore()}>
                                もっと見る
                            </Button>
                        </Grid>
                    </Grid>
                    }
                </CardContent>
            </div>
        );
    }
}



UserList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(compose(
    withStyles(styles),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(UserList))