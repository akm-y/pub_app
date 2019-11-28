import React, { Component } from 'react';
import '../assets/scss/App.scss';
import {createMuiTheme, MuiThemeProvider, withStyles} from "@material-ui/core";
import {compose} from "redux";
import {connect} from "react-redux";
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';

import { fade } from '@material-ui/core/styles/colorManipulator';
import PropTypes from "prop-types";

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Entries from './Entries'
import TeamList from '../component/TeamList'
import store from "../store";
import Api from "~/src/util/apis";
import AwsAuth from '../util/aws'
import Common from '../util/common'
import {mapDispatchToProps, mapStateToProps} from "../action";
import SearchIcon from "./MainHeader";
import InputBase from '@material-ui/core/InputBase';
import SideFriendRecommendList from '../component/SideFriendRecommendList'
import UserList from "./UserList";

const drawerWidth = 240;

const styles = theme => ({
    media: {
        // ⚠️ object-fit is not supported by IE 11.
        objectFit: 'cover',
    },
    pcMain: {
        // marginTop: '30',
        // [theme.breakpoints.down('sm')]: {
        //     marginTop: '30',
        //     height: 190,
        //     display: 'flex',
        // }
    },
    root: {
        flexGrow: 1,
    },
    content: {
        flexGrow: 1,
        // padding: theme.spacing.unit * 3,
        // marginTop: 60,
        margin: '0 auto',
        // maxWidth: '90%',
        borderRadius: '1em',

    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    center:{
        display:'flex',
        justifyContent:'center',
    },
    friendListpaper:{
      padding:0
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing.unit * 2,
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing.unit * 3,
            width: 'auto',
        },
    },
    searchIcon: {
        width: theme.spacing.unit * 9,
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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

class MainContents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            anchorEl: null,
            mobileMoreAnchorEl: null,
        };
    }
    componentWillMount = async () =>{
        console.log(Common.crypt(store.getState().user_id,2))
    }


    render() {
        const { classes,theme } = this.props;
        return (
            <main className={classes.content} >
                <Grid container className={classes.root} justify="center" alignContent="center">
                    <Grid item xs={11} sm={11} md={10} lg={10}>
                        <div className="contents">
                            <Grid container justify="center">
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    <Card class="card">
                                        <CardContent>
                                            <div gutterBottom variant="headline" color="inherit" component="h2" noWrap
                                                 className="main_title">
                                                <h2>最新の投稿</h2>
                                            </div>
                                            <Entries type="home"/>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </div>
                        <div className="contents">
                            <Grid container justify="center">
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    <Card class="card">
                                        <CardContent>
                                            <div gutterBottom variant="headline" color="inherit" component="h2" noWrap
                                                 className="main_title">
                                                <h2>おすすめのユーザ</h2>
                                            </div>
                                            <UserList type="recommend"/>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </div>

                        <div className="contents">
                            <Grid container justify="center">
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    <Card class="card">
                                        <CardContent>
                                            <div gutterBottom variant="headline" color="inherit" component="h2" noWrap
                                                 className="main_title">
                                                <h2>おすすめのチーム</h2>
                                            </div>
                                            <TeamList type="recommend"/>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </div>
                    </Grid>
                </Grid>
            </main>
        );
    }
}
MainContents.propTypes = {
    classes: PropTypes.object.isRequired,
}
export default compose(
    withStyles(styles),
    connect(
        mapStateToProps,
        mapDispatchToProps,
    )
)(MainContents)