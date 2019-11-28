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
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import CircularProgress from "@material-ui/core/CircularProgress";
import Fade from "@material-ui/core/Fade";
import Loading from "./Loading";
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
        paddingBottom:20

    },
    contents:{
        marginTop:30,
        color:"#29b6f6",
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
    fs07:{
        fontSize:"0.7em"
    },

    fs12:{
        fontSize:"1.2em"
    },
    checked: {},
    card: {
        width: 320,
        // height:270
    },
    cardContents:{
        height:210
    },
    media: {
        height: 100,
    },
    pd10:{
        padding:10
    }

});


class Entries extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedValue: ['a'],
            items:[],
            isRadioBtn:false,
            list_show_flg: false,
            spacing: 0,
            display_loading:false,
            user_id:store.getState().user_id,
            title:''

        };

        if (window.innerWidth >= 960){
            this.setState({
                spacing:24
            })
        } else {
            this.setState({
                spacing:0
            })
        }


        this.friendSelected = this.handleChange;
        //友達リストにラジオボタンを持たせる 使ってない？
        this.state.isRadioBtn = (this.props.type === "radio");

    };
    componentDidUpdate = async(prevProps, prevState)=> {

        let search = window.location.search
        if(prevProps.location.search !== window.location.search){

            await this.setState({
                user_id:decodeURIComponent(search.split("=")[1]),
                display_loading:true,
            })
            await this.getPersonalEntry()()
        }
    }

    componentWillMount = async () => {

    };
    componentDidMount = async () => {
        await this.setState({
            display_loading:true,
        })

        let user_id = ''
        switch (this.props.type) {
            case "home":
                await this.getAll()
                await this.setState({display_loading:false})
                return;
            case "userInfo":
                const params = new URLSearchParams(this.props.location.search);
                user_id = params.get('cd');

                await this.setState({
                    user_id:user_id,
                })
                await this.getPersonalEntry();
                await this.setState({display_loading:false})
                return;
            case "mine":
                await this.getPersonalEntry();
                await this.setState({display_loading:false})

                return

            case "team":
                await this.getTeamEntry();
                await this.setState({display_loading:false})
                return
            default:
                this.getAll()
                return;
        }

    };

    //API
    getAll = async () =>{
        let params = new URLSearchParams();

        params.set('user_id', this.state.user_id);
        let _this = this
        await Api.getEntriesAll(params).then(
            function(response){
                _this.setState({
                    items:response.entries,
                });
                if(response.entries.length > 0){
                    _this.setState({
                        list_show_flg:true
                    })
                }
            }
        )
    }
    getPersonalEntry = async () =>{
        let params = new URLSearchParams();
        params.set('user_id', this.state.user_id);
        let _this = this
        await Api.getEntries(params).then(
            function(response){
                console.log("entries:"+response.entries)
                _this.setState({
                    items:response.entries,
                });
                if(_this.state.items.length > 0){
                    _this.setState({
                        list_show_flg:true
                    })
                }
            }
        )
    }

    getTeamEntry = async () =>{
        let params = new URLSearchParams();
        await params.set('user_id', this.state.user_id);
        let _this = this

        //要API作成
        await Api.getTeamEntries(params).then(
            function(response){
                console.log("response:"+response)
                _this.setState({
                    items:response.entries,
                });
                if(_this.state.items.length > 0){
                    _this.setState({
                        list_show_flg:true
                    })
                }
            }
        )
    }
    goNext = async(val)=>{
        try{
            await this.props.history.push({
                pathname: '/entry/'+val.entry_id,
                state:{
                    entry: val
                }
            })
        } catch (e){
            this.goError(e)
        }

    };
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
    strTriming(val){
        let str = ""
        console.log(val)
        if(val.title !== undefined){
            str = val.title
            if(str.length >= 10){
                str= str.slice(0,10) + '...'
            }
        }
        return str
    }
    goEntryMore = async(val)=>{
        try{
            await this.props.history.push({
                pathname: '/entry/more',
                type:this.props.type
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
            <Fade in={!this.state.display_loading}>
                <Grid container justify="center" alignItems="center" className={classes.contents}>
                    <Grid item xs={12} lg={12}>
                                <Grid container justify="center" alignItems="center" className={classes.itemList}>
                                {this.state.list_show_flg &&
                                this.state.items.map(function (value, id) {
                                    console.log(JSON.stringify(value))
                                return (
                                <Grid item lg={3} key={id} className={classes.pd10}>
                                <Grid container className={classes.root} justify="center" alignItems="center">
                                <Card className={classes.card}>
                                <CardActionArea onClick={() => this.goNext(value)} className={classes.cardContents}>
                                <CardMedia
                                className={classes.media}
                                image="/static/images/cards/contemplative-reptile.jpg"
                                title="Contemplative Reptile"
                                />
                                <CardContent>
                                <Typography gutterBottom variant="h5" component="h2" className={classes.fs12}>
                                {this.strTriming(value.title)}
                                </Typography>
                                {/*<Typography variant="body2" color="textSecondary" component="p">*/}
                                {/*Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging*/}
                                {/*across all continents except Antarctica*/}
                                {/*</Typography>*/}
                                </CardContent>
                                </CardActionArea>
                                    <ListItem key={id} button>
                                        <ListItemText id={id} className={classes.fs07} primary={value.title} />
                                    </ListItem>
                                </Card>
                                </Grid>
                                </Grid>
                                );
                                }, this)}
                                </Grid>
                                    {this.state.list_show_flg &&
                                        <Grid container justify="flex-end" alignItems="right" alignContent="right">
                                            <Grid item lg={2}>
                                                <Button variant="contained" color="primary" className={classes.button}
                                                        onClick={() => this.goEntryMore()}>
                                                    もっと見る
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    }
                              </Grid>
                </Grid>
            </Fade>
       );
    }
}



Entries.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(compose(
    withStyles(styles),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(Entries))