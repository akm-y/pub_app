import React, { Component } from 'react';
import '../assets/scss/App.scss';
import {createMuiTheme, List, MuiThemeProvider, withStyles} from "@material-ui/core";
import classnames from 'classnames';
import {compose} from "redux";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {mapDispatchToProps, mapStateToProps} from "../action";
import "react-mde/lib/styles/css/react-mde-all.css";
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import MainHeader from "../component/MainHeader";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import ProfileDisplayBasic from '../component/ProfileDisplayBasic'
import ProfileDisplayCarrer from '../component/ProfileDisplayCarrer'

const styles = theme => ({
    userCard:{
        position:"relative",
        top:-80
    },
    imageSrc: {
        backgroundSize: 'cover',
        // width:'100%',
        height:"300px",
        backgroundPosition: 'center 40%',
        padding:2
    }
});
function typographyV1Theme(theme) {
    return createMuiTheme({
        ...theme,
        typography: {
            useNextVariants: false,
        },
    });
}
function TabContainer(props) {
    return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
            {props.children}
        </Typography>
    );
}
function LinkTab(props) {
    return <Tab component="a" onClick={event => event.preventDefault()} {...props} />;
}
// https://github.com/andrerpena/react-mde/blob/master/src/components/MdePreview.tsx

class FriendDetail extends Component {
    constructor(props) {
        super(props);
        // let params = new URLSearchParams(this.props.location.search)
        // const user_id = params.get('cd');

        this.state = {
            user_id:this.props.location.state.user_id
        };

    }
    componentWillMount = async ()=> {
    }
    getUserId =()=>{
        return "aa"
    }
    getImage = (url) => { return require(`${url}`) };
    componentDidMount= async()=> {
        await this.setState({
            user_id:this.props.location.state.user_id
        })
    };
    goProfileDisplay = async () =>{
        await this.props.history.push({
            pathname: '/profile/detail/',
            state:{
                for:'myAccount'
            }
        })

    }
    render() {
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
                    </Grid>
                </Grid>
            </div>
        );
    }
}
FriendDetail.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default compose(
    withStyles(styles),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(FriendDetail)