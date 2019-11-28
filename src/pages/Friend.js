import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {createMuiTheme, MuiThemeProvider, withStyles} from "@material-ui/core";
import {compose} from "redux";
import {connect} from "react-redux";
import '../assets/scss/App.scss';
import {mapDispatchToProps, mapStateToProps} from "../action";
import Grid from "@material-ui/core/Grid";
import MyFriend from "../component/MyFriend";
import green from "@material-ui/core/colors/green";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

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
    name: {

    },
    prof:{
        fontSize:"0.7em"
    },
    checked: {},
});

class Friend extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { classes, theme } = this.props;

        return (
            <main className={classes.content}>
                <Grid container className={classes.root} justify="center" alignContent="center">
                    <Grid item xs={11} sm={11} md={10} lg={10}>
                        <div className="contents">
                            <Grid container justify="center">
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    <Card class="card">
                                        <CardContent>
                                            <MyFriend/>
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
Friend.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default compose(
    withStyles(styles),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(Friend)