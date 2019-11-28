// Cognitoのサインイン処理にて届いたアクティベーションコードを入力し、サインインを完了する。
// COgnitoサインイン完了と同時にアプリへのログイン処理を行う。
// アプリ側tokenテーブルにCognitoから取得したtokenを設定し、ログインフラグを1にする。
// tokenはログイン以降APIのコールに必須のパラメータとする。
// ログイン時は更新処理を行う。

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles,createMuiTheme,MuiThemeProvider} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { connect } from "react-redux"
import { mapStateToProps,mapDispatchToProps } from '../action.js';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { compose } from 'redux'
import store from '../store'
import {GenderField,BirthDayField} from '../component/InputComponents'
import Header from '../component/Header'
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import FormattedInputs from "../component/FormattedInputs";
import MultipleSelect from "./InputSkill";
import AwsAuth from '../util/aws'
import Api from '../util/apis'
import {Link} from "react-router-dom";
import Card from "@material-ui/core/Card";

const styles = theme => ({
    contents: {
        margin: '150px auto 0 ',
        maxWidth : '1260px',
    },
    formContents:{
        margin: '0 auto',
        maxWidth: '480px'
    },
    formControl:{
        display:'block',
        width:'100%'
    },
    btn:{
        marginTop:'20px',
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

class Activate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            registerCode: '',
            user_id: this.props.location.state.user_id,
            password: this.props.location.state.password,
            errors: [],
            token:'',
            // user_id: this.props.location.state.user_id

        };
    }
    goError = async (e) => {
        await this.setState(
            {errors: (e.message || JSON.stringify(e))}
        )
    };
    goNext = async () => {
        try{
            await this.props.history.push({
                pathname: '/profile/input/',
                state:{
                    user_id: this.state.user_id,
                    email: this.state.email
                }
            })
        } catch (e){
            this.goError(e)
        }
    };

    //アプリログイン処理
    doLogin =  async () => {
        await AwsAuth.doLogin(this.state.user_id, this.state.password).then(this.goNext).catch(this.goError)
    };

    //認証コードを連携
    register = async () => {
        await AwsAuth.confirmRegistration(this.state.user_id, this.state.password, this.state.registerCode).then(this.doLogin).catch(this.goError)
    };
    handleChange = async event => {
        await this.setState(
            {[event.target.name]:event.target.value}
        );

    };
    resendConfirmationCode = async() =>{
        await AwsAuth.resendConfirmationCode(this.state.user_id,this.state.password).then(
            await alert("認証コードを再送しました。")
        ).catch()
    }
    render() {
        const { classes,dispatchAddValue } = this.props;
        return (
            <MuiThemeProvider theme={typographyV1Theme}>
                <AppBar color="primary">
                    <Header/>
                </AppBar>
                <div className={classes.contents}>
                    <p>認証コードを入力してください</p>
                <div className={classes.formContents}>
                    <Grid container spacing={16}>
                        <Grid item xs={12} sm={12}>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="component-simple">認証コード</InputLabel>
                                <Input id="component-simple" name="registerCode"  fullWidth defaultValue={this.props.registerCode} onChange={this.handleChange} />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={16}>
                        <Grid item xs={12} sm={12}>
                            {this.state.errors}
                        </Grid>
                    </Grid>

                    <Grid className={classes.btn} container spacing={16}>
                        <Grid item xs={12} sm={12}>
                            <Button variant="contained" color="secondary" fullWidth className={classes.fcButton} onClick={this.register}>
                               認証
                            </Button>
                        </Grid>
                    </Grid>
                    <Link onClick={this.resendConfirmationCode.bind(this)} >検証コード</Link>
                </div>
            </div>
            </MuiThemeProvider>
        );

    }
}

Activate.propTypes = {
    classes: PropTypes.object.isRequired,
};
 // export default withStyles(styles)(InputProfile);
export default compose(
    withStyles(styles),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(Activate)