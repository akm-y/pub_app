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
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/core/SvgIcon/SvgIcon";
const styles = theme => ({
    root: {
        width: '100%',
        // maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
        marginBottom: 20
    },
    inline: {
        display: 'inline',
    },
    link:{
        textDecoration: 'none',
    },
    friendList:{
        height:'100vh',
        fontSize:'1.6rem'
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    cardContent:{
        padding:'0!important',
        // height:300,
        overflowY:'scroll',
        border:'solid 1px highgray',
    },
    green: {
        color: green[400],
        '&$checked': {
            color: green[600],
        },
    },
    card:{
        borderRadius: '1em',
    },
    search:{
        padding: 8,
        borderBottom: 'solid 1px lightgray',
        // borderRadius: '0.5em',
        width:'100%',
        outline:0
    },
    checked: {},
});
const dudUrl = 'javascript:;';

class SideFriendRecommendList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedValue: ['a'],
            items:this.props.friendList,
            isRadioBtn:false,
            initialItem:this.props.friendList,
            list_show_flg: this.props.show

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
        this.getList()

        this.friendSelected = this.handleChange;
        //友達リストにラジオボタンを持たせる
        this.state.isRadioBtn = (this.props.type === "radio");

    };
    componentDidMount = async () => {
     await this.setState({items: this.state.initialItem})
        this.state.items.map(function(value) {
        });
    };

    //API
    getList = async () =>{
        let _this = this
        _this.state.friends = store.getState().friends
        let params = new URLSearchParams();
        params.set('user_id', store.getState().user_id);
        await Api.getRecommendFriends(params).then(
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
        await console.log(this.state.items[0].profile.basic_info)
    }
    //基本は空
    friendSelected = () =>{};

    //クリックした友達のIDを受け取って何かする
    handleChange = async val =>{
        //ユーザの詳細画面へ遷移
        try{
            const params = new URLSearchParams(location.search);
            params.set('cd', val);
            await this.props.history.push({
                pathname: '/friend/detail',
                search:params.toString(),
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
    render() {

        const { classes } = this.props;
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
            <div className={classes.root}>
                おすすめのユーザー
                {this.state.list_show_flg &&
                    <Grid container>
                        <Grid item xs={12} lg={12}>
                            <CardContent className={classes.cardContent}>
                                <List className={classes.root}>
                                    {this.state.items.map(function (value, id) {
                                        console.log(value)
                                        let pic = 'https://dol.ismcdn.jp/mwimgs/8/d/670m/img_8db0612c13c0013326bfb1b66431df95645897.jpg';
                                        return (
                                        <div>
                                            <Link
                                                component="button"
                                                onClick={() => this.friendSelected(value.user_id)}
                                            >
                                                <ListItem alignItems="flex-start">
                                                    <ListItemAvatar>
                                                        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={value.profile.basic_info.first_name + value.profile.basic_info.last_name}
                                                        secondary={
                                                            <React.Fragment>
                                                                <Typography component="span" className={classes.inline} color="textPrimary">
                                                                    {value.profile.basic_info.first_name}
                                                                </Typography>
                                                            </React.Fragment>
                                                        }
                                                    />
                                                </ListItem>
                                            </Link>
                                        </div>
                                       )
                                    }, this)}
                            </List>
                        </CardContent>
                        </Grid>
                    </Grid>
                }
            </div>
        );
    }
}



SideFriendRecommendList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(compose(
    withStyles(styles),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(SideFriendRecommendList))