import React, { Component } from 'react';
import '../assets/scss/App.scss';
import {createMuiTheme, List, MuiThemeProvider, withStyles} from "@material-ui/core";
import classnames from 'classnames';

import {compose} from "redux";
import {connect} from "react-redux";
import PropTypes from "prop-types";

import Api from "~/src/util/apis";
import store from "../store";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {mapDispatchToProps, mapStateToProps} from "../action";
import "react-mde/lib/styles/css/react-mde-all.css";
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import ProfileDisplayBasic from '../component/ProfileDisplayBasic'
import ProfileDisplayCarrer from '../component/ProfileDisplayCarrer'

import MainHeader from "../component/MainHeader";
import Fade from "@material-ui/core/Fade";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";


const styles = theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    imageSrc: {
        backgroundSize: 'cover',
        // width:'100%',
         height:"300px",
         backgroundPosition: 'center 40%',
        padding:2
    },
    main: {
        textAlign: "center"
    },
    bigAvatar: {
        margin: "220px auto 0",
        width: 160,
        height: 160,
    },
    edit:{
        flexGrow: 1,
        marginTop: '90px',
        marginBottom: '45px'
    },
    profileEdit:{
        textAlign: "right",
        paddingRight: "5px"
    },
    skillEdit:{
        textAlign: "left",
        paddingLeft: "5px"
    },
    card: {
        maxWidth: 345,
    },
    media: {
        height: 140,
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
class MyPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user_id: store.getState().user_id,
        }
    }
    componentDidMount = async ()=> {
    }

    render(){
        const { classes} = this.props;
        const { value } = this.state;
        return (
            <div className={classes.root} id="entry">
                <MainHeader/>
                <Grid container justify="center" alignItems="center">
                    <Grid item xs={12} sm={12} lg={8} md={8} >
                        <Grid container justify="center">
                            <Grid item xs={11} md={12} sm={11} lg={12}>
                                <Card class="card">
                                    <CardContent>
                                        <ProfileDisplayBasic target_user_id ={this.state.user_id}/>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                        <Grid container justify="center">
                            <Grid item xs={11} sm={11} md={12} lg={12}>
                                <Card class="card">
                                    <CardContent>
                                        <ProfileDisplayCarrer target_user_id ={this.state.user_id}/>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                        {/*<ProfileDisplay target_user_id ={this.state.user_id} />*/}
                    </Grid>
                </Grid>
            </div>
        );
    }
}
MyPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default compose(
    withStyles(styles),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(MyPage)