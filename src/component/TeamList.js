import React, { Component } from 'react';
import '../assets/scss/App.scss';
import {createMuiTheme, List, MuiThemeProvider, withStyles} from "@material-ui/core";
import classnames from 'classnames';

import {compose} from "redux";
import {connect} from "react-redux";
import PropTypes from "prop-types";

import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import Api from "~/src/util/apis";
import store from "../store";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import {mapDispatchToProps, mapStateToProps} from "../action";
import { withRouter } from 'react-router';
import ButtonBase from '@material-ui/core/ButtonBase';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import green from "@material-ui/core/colors/green";
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import RecordVoiceOverTwoToneIcon from '@material-ui/icons/RecordVoiceOverTwoTone';


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
class TeamList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user_id: store.getState().user_id,
            expanded: false,
            teams:[],
            list_show_flg: false,
            spacing: 0,
            items:[],
            title:this.props.title,
        };
    }
    getImage = (url) => { return require(`${url}`) };
    handleExpandClick = () => {
        this.setState(state => ({ expanded: !this.state.expanded }));
    };
    componentDidMount = async()=> {
        if (window.innerWidth >= 960){
            this.setState({
                spacing:24
            })
        } else {
            this.setState({
                spacing:0
            })
        }
        if(this.props.type==="recommend") {
            this.getRecommend()
        }
        if(this.props.type==="belong"){
            this.getBelong()
        }
    };
    getRecommend = async ()=>{
        let params = new URLSearchParams();
        params.set('user_id', this.state.user_id);
        let _this = this;
        await Api.getRecommendTeam(params).then(
            async function(response){
                await _this.setState({
                    items:response.teams,
                });
                console.log(response)
                if(_this.state.items.length > 0){
                    await _this.setState({
                        list_show_flg:true
                    })
                }
            }
        ).catch(
        )
    }
    getBelong = async ()=>{
        let params = new URLSearchParams();
        params.set('user_id', this.state.user_id);
        let _this = this;
        await Api.getBelongTeam(params).then(
            function(response){
                console.log(response)
                _this.setState({
                    items:response.team,
                });
                if(_this.state.items.length > 0){
                    _this.setState({
                        list_show_flg:true
                    })
                }
            }
        ).catch(
        )
    }
    goNext = async(val)=>{
        try{
            await this.props.history.push({
                pathname: '/team/'+val.team_id,
                state:{
                    team: val
                }
            })
        } catch (e){
            this.goError(e)
        }

    };
    goError = async (e) => {
        await this.setState(
            {errors: (e.message || JSON.stringify(e))}
        )
        await console.log("エラー:"+this.state.errors)
    };

    goTeamMore = async(val)=>{
        try{
            await this.props.history.push({
                pathname: '/team/more',
                type:this.props.type
            })
        } catch (e){
            this.goError(e)
        }

    };

    render() {
        const { classes} = this.props;
        return (
            <Grid container justify="center" alignItems="center" className={classes.contents}>
                <Grid item xs={12} lg={12}>
                        <Grid container justify="center" alignItems="center" className={classes.itemList}>
                            {this.state.list_show_flg &&
                            this.state.items.map(function (value, id) {
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
                                                            {/*{this.strTriming(value)}*/}
                                                        </Typography>
                                                        {/*<Typography variant="body2" color="textSecondary" component="p">*/}
                                                        {/*Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging*/}
                                                        {/*across all continents except Antarctica*/}
                                                        {/*</Typography>*/}
                                                    </CardContent>
                                                </CardActionArea>
                                                <ListItem key={id} button>
                                                    <ListItemText id={id} className={classes.fs07} primary={value.name} />
                                                    {(value.role === 2)?
                                                        <RecordVoiceOverTwoToneIcon color={"primary"}/>:""
                                                    }
                                                </ListItem>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                );
                            }, this)}
                        </Grid>
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
        );
    }
}
TeamList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(compose(
    withStyles(styles),
    connect(
        mapStateToProps,
        mapDispatchToProps,
    )
)(TeamList))