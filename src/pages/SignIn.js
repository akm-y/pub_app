// Cognitoへサインインを行う。
// サインインすると入力したメールアドレスへ認証コードが届く。
// サインイン時には名前とメールアドレスをアプリのstoreに保存する。（setProdile）
// storeの情報を基にアプリ側のMysqlへ情報の登録APIをコールする。

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
import Common from '../util/common'

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

class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            user_id: '',
            email:'',
            errors:[],
            basic_info:{
                first_name:"",
                last_name: "",
                prefecture:"",
                active_aria:"",
                year: "",
                month:"",
                day: "",
                gender:"",
                job_status: "",
            },
        };
    }
    goError = async (e) => {
        await this.setState(
            {errors: (e.message || JSON.stringify(e))}
        )
        await console.log("エラー:"+this.state.errors)
    };
    goNext = async () => {
        try{
            await this.props.history.push({
                pathname: '/activate',
                state:{
                    user_name: this.state.user_id,
                    password: this.state.password,
                    email: this.state.email,
                    user_id:this.state.user_id
                }
            })
        } catch (e){
            this.goError(e)
        }
    };
    registerDB = async() =>{
        const _this = this
        // await this.props.setProfile(this.state.profile)
        let params = new URLSearchParams();
        params.set('user_id', this.state.user_id);
        params.set('email', this.state.email);

        await Api.postUser(params).then(
            await function(response) {
                console.log("signin:"+response.user_id)
                _this.props.setUserId(response.user_id)
            },
        ).then(
            this.goNext
        ).catch(this.goError)
    };
    signInCognito = async () => {
        await alert(this.state.user_id)
        await AwsAuth.signUp(this.state.user_id,this.state.password,this.state.email)
            .then(this.registerDB)
            .catch(this.goError)
    };
    handleChange = async event => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({
            [name]:value
        });
        // await this.setStore( [name],value)
    };
    setStore = async (name, value)=>{
        const cloneProfile = Object.assign({},store.getState().profile);
        cloneProfile[name] = value;

        //stateにセット
        await this.setState(
            {"profile":cloneProfile}
        );
        //stateをstoreに保存
        await this.props.setProfile(cloneProfile)
    }

    render() {
        const { classes,dispatchAddValue } = this.props;
        return (
            <MuiThemeProvider theme={typographyV1Theme}>
                <AppBar color="primary">
                    <Header/>
                </AppBar>
                <div className={classes.contents}>
                    <p>お名前をメールアドレスを入力してください。</p>
                </div>
                <div className={classes.formContents}>
                    <Grid container spacing={16}>
                        <Grid item xs={12} sm={12}>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="component-simple">ID</InputLabel>
                                <Input id="component-simple" name="user_id"  fullWidth defaultValue={this.state.user_id} onChange={this.handleChange} />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={16}>
                        <Grid item xs={12} sm={12}>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="component-simple">パスワード</InputLabel>
                                <Input id="component-simple"　name="password" fullWidth defaultValue={this.state.password} onChange={this.handleChange} />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={16}>
                        <Grid item xs={12} sm={12}>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="component-simple">メールアドレス</InputLabel>
                                <Input id="component-simple" name="email"  fullWidth defaultValue={this.state.email} onChange={this.handleChange} />
                            </FormControl>
                        </Grid>
                    </Grid>
                    {/*<Grid container spacing={16}>*/}
                        {/*<Grid item xs={6} sm={6}>*/}
                            {/*<FormControl className={classes.formControl}>*/}
                                {/*<InputLabel htmlFor="component-simple">せい</InputLabel>*/}
                                {/*<Input id="component-simple" name="first_name_kana" fullWidth defaultValue={this.props.profile.first_name_kana} onChange={this.handleChange} />*/}
                            {/*</FormControl>*/}
                        {/*</Grid>*/}
                        {/*<Grid item xs={6} sm={6}>*/}
                            {/*<FormControl className={classes.formControl}>*/}
                                {/*<InputLabel htmlFor="component-simple">めい</InputLabel>*/}
                                {/*<Input id="component-simple"　name="last_name_kana" fullWidth defaultValue={this.props.profile.last_name_kana} onChange={this.handleChange} />*/}
                            {/*</FormControl>*/}
                        {/*</Grid>*/}
                    {/*</Grid>*/}
                    {/*<Grid container spacing={16}>*/}
                        {/*<Grid item xs={3} sm={3}>*/}
                            {/*<FormattedInputs zip={this.props.profile.zip}  setProfile={this.props.setProfile}/>*/}
                        {/*</Grid>*/}
                    {/*</Grid>*/}
                    {/*<Grid container spacing={16}>*/}
                        {/*<Grid item xs={9} sm={9}>*/}
                            {/*<FormControl className={classes.formControl}>*/}
                                {/*<InputLabel htmlFor="component-simple">都道府県</InputLabel>*/}
                                {/*<Input id="component-simple"  name="prefecture" defaultValue={this.props.profile.prefecture} onChange={this.handleChange} onKeyUp="AjaxZip3.zip2addr(this,'','addr11','addr11');"/>*/}
                            {/*</FormControl>*/}
                        {/*</Grid>*/}
                    {/*</Grid>*/}
                    {/*<Grid container spacing={16}>*/}
                        {/*<Grid item xs={9} sm={9}>*/}
                            {/*<FormControl className={classes.formControl}>*/}
                                {/*<InputLabel htmlFor="component-simple">市町村区</InputLabel>*/}
                                {/*<Input id="component-simple" name="city" fullWidth defaultValue={this.props.profile.city} onChange={this.handleChange} />*/}
                            {/*</FormControl>*/}
                        {/*</Grid>*/}
                    {/*</Grid>*/}
                    {/*<Grid container spacing={16}>*/}
                        {/*<Grid item xs={9} sm={9}>*/}
                            {/*<FormControl className={classes.formControl}>*/}
                                {/*<InputLabel htmlFor="component-simple"></InputLabel>*/}
                                {/*<Input id="component-simple" name="address" fullWidth defaultValue={this.props.profile.address} onChange={this.handleChange} />*/}
                            {/*</FormControl>*/}
                        {/*</Grid>*/}
                    {/*</Grid>*/}
                    {/*<Grid container spacing={16}>*/}
                        {/*<Grid item xs={3} sm={3}>*/}
                            {/*<GenderField gender={this.props.profile.gender} setProfile={this.props.setProfile}/>*/}
                        {/*</Grid>*/}
                    {/*</Grid>*/}
                    {/*<Grid container spacing={16}>*/}
                        {/*<Grid item xs={6} sm={6}>*/}
                            {/*<BirthDayField year={this.props.profile.year} month={this.props.profile.month} day={this.props.profile.day} setProfile={this.props.setProfile}/>*/}
                        {/*</Grid>*/}
                    {/*</Grid>*/}
                    {/*<Grid container spacing={16}>*/}
                        {/*<Grid item xs={6} sm={6}>*/}
                            {/*<FormControl className={classes.formControl}>*/}
                                {/*<InputLabel htmlFor="component-simple">職業</InputLabel>*/}
                                {/*<Input id="component-simple" name="job" fullWidth defaultValue={this.props.profile.job} onChange={this.handleChange} />*/}
                            {/*</FormControl>*/}
                        {/*</Grid>*/}
                    {/*</Grid>*/}
                    <Grid container spacing={16}>
                        <Grid item xs={12} sm={12}>
                            {this.state.errors}
                        </Grid>
                    </Grid>

                    <Grid className={classes.btn} container spacing={16}>
                        <Grid item xs={12} sm={12}>
                            <Button variant="contained" color="secondary" fullWidth className={classes.fcButton} onClick={this.signInCognito}>
                               次へ
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            </MuiThemeProvider>
        );

    }
}

SignIn.propTypes = {
    classes: PropTypes.object.isRequired,
};
 // export default withStyles(styles)(InputProfile);
export default compose(
    withStyles(styles),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(SignIn)