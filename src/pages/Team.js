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
import TeamList from "../component/TeamList";
import Entries from "./EntryMore";
import PostTeam from "./PostTeam";

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
        height:270
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
class Team extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user_id:store.getState().user_id,
            title:'所属チーム',
        };
    }
    getImage = (url) => { return require(`${url}`) };
    handleExpandClick = () => {
        this.setState(state => ({ expanded: !this.state.expanded }));
    };
    componentWillMount = async()=> {

    };
    render() {
        const { classes} = this.props;
        return (
            <main className={classes.content}>
                <Grid container className={classes.root} justify="center" alignContent="center">
                    <Grid item xs={11} sm={11} md={10} lg={10}>
                        <div className="contents">
                            <Grid container justify="center">
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    <Card class="card">
                                        <CardContent>
                                            <div gutterBottom variant="headline" color="inherit" component="h2" noWrap
                                                 className="main_title">
                                                <h2>所属チーム</h2>
                                            </div>
                                            <TeamList type="belong" target_user_id={this.state.user_id}/>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </div>
                    </Grid>
                </Grid>
                <div className="addBtn">
                    <PostTeam/>
                </div>
            </main>
        );
    }
}
Team.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(compose(
    withStyles(styles),
    connect(
        mapStateToProps,
        mapDispatchToProps,
    )
)(Team))