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

import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/core/SvgIcon/SvgIcon";
import CircularProgress from "@material-ui/core/CircularProgress";
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
        color:"#29b6f6",
        textAlign: 'center',
        paddingTop:20,
        paddingBottom:20,
    },
    contents:{
        marginTop:40,
        color:"#78909c",
        textAlign: 'center',
    },

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
const dudUrl = 'javascript:;';

class FriendRecommendList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedValue: ['a'],
            items:this.props.friendList,
            isRadioBtn:false,
            initialItem:this.props.friendList,
            list_show_flg: this.props.show,
            display_loading:true,
            target_user_id:this.props.user_id

            // initialItem:Array(100).fill(0).map((_,value)=>String(value+1))
        };
        // propsによって実行する関数を変える
        // switch (this.props.friend) {
        //     case "A":
        //         this.friendSelected = this.handleChangeA;
        //         return;
        //     case "B":
        //         this.friendSelected = this.handleChangeA;
        //         return;
        //     default:
        //         return;
        // }

    };
    componentWillMount = async () => {
        alert(this.props.type)
        if (window.innerWidth >= 960){
            this.setState({
                spacing:24
            })
        } else {
            this.setState({
                spacing:0
            })
        }

        this.getList(this.state.target_user_id)

        //友達リストにラジオボタンを持たせる
        this.state.isRadioBtn = (this.props.type === "radio");

        await this.setState({items: this.state.initialItem})

    };

    //val= user_id
    getList = async (val) =>{
        let _this = this

        _this.state.friends = store.getState().friends

        let params = new URLSearchParams();
        params.set('user_id', store.getState().user_id);

        await Api.getFriends(params).then(
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
                _this.setState({
                    display_loading:false,
                })

            }
        );
        await console.log(this.state.items[0].profile.basic_info)
    }

    //クリックした友達のIDを受け取って何かする
    friendSelected = async val =>{
        //ユーザの詳細画面へ遷移
        try{
            // const params = new URLSearchParams(location.search);
            // params.set('cd', val);
            await this.props.history.push({
                pathname: '/friend/detail',
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
        if (display_loading) {
            return(
                <div style={loading_style}>
                    <CircularProgress  ariant="determinate" value={this.state.completed} size={24} className={classes.display_loading} />
                </div>
            )
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

        return (
            <Grid container>
                <Grid container justify="center" alignItems="center" className={classes.contents}>
                    {/*<Grid container justify="center" alignItems="center">*/}
                        {/*<Grid item xs={12} lg={12}>*/}
                            {/*<h1 className={"subject"}><span>おすすめのメンバー</span></h1>*/}
                        {/*</Grid>*/}
                    {/*</Grid>*/}
                    <Grid container className={classes.root} justify="center" alignItems="center">
                        <Grid item xs={12} lg={12}>
                            <Grid container justify="center" alignItems="center" className={classes.itemList}>
                                {this.state.list_show_flg &&
                                this.state.items.map(function (value, id) {
                                    return (
                                        <Grid item lg={2} key={id} className={classes.user} onClick={()=>this.friendSelected(value.user_id)}>
                                            <Grid container className={classes.root} justify="center" alignItems="center">
                                                <Grid item lg={12} className={classes.avatar}>
                                                    <Avatar alt="Remy Sharp" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7y2ebQyL17EfrE3mkCyOrhwY60w1z2kFe9_u9_TaGc3usyaPM" className={classes.bigAvatar}/>
                                                </Grid>
                                                <Grid item lg={12} >
                                                    <p className={classes.name}>{value.profile.basic_info.first_name}　{value.profile.basic_info.last_name}</p>
                                                    <p className={classes.prof}>バックエンドエンジニア</p>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    );
                                }, this)}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container justify="flex-end" alignItems="right" alignContent="right">
                    <Grid item lg={2}>
                        <Button variant="contained" color="primary" className={classes.button} onClick={()=>this.goFriendMore()} >
                            もっと見る
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}



FriendRecommendList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(compose(
    withStyles(styles),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(FriendRecommendList))