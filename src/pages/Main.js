import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {createMuiTheme, MuiThemeProvider, withStyles} from "@material-ui/core";
import {compose} from "redux";
import {connect} from "react-redux";
import CssBaseline from '@material-ui/core/CssBaseline';
import FriendDetail from '~/src/pages/FriendDetail';
import { theme } from '../theme/theme';
import MainHeader from "../component/MainHeader";
import MainContents from "../component/MainContents";
import {Route, Switch} from "react-router";
import '../assets/scss/App.scss';
import {mapDispatchToProps, mapStateToProps} from "../action";

const styles = theme => ({
    media: {
        // ⚠️ object-fit is not supported by IE 11.
        objectFit: 'cover',
    },
    root: {
        display: 'flex',
        position: 'absolute',
        right:0,
        left:0,

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

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            anchorEl: null,
            mobileMoreAnchorEl: null,
        };
        const { classes, theme } = this.props;
    }

    render() {
        const { classes,dispatchAddValue } = this.props;

        return (
            <MuiThemeProvider theme={typographyV1Theme(theme)}>
                <div className={classes.root}>
                    <CssBaseline />
                    <MainHeader/>
                    <Route exact path={'/'} component={MainContents} />
                    {/*<Route path={'/friend/detail'} component={FriendDetail}/>*/}
                    {/*<MainContents/>*/}
                </div>
            </MuiThemeProvider>
    );
    }
}
Main.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default compose(
    withStyles(styles),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(Main)