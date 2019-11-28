import React from 'react';
import PropTypes from 'prop-types';
import { withStyles,createMuiTheme,MuiThemeProvider} from '@material-ui/core/styles';
import classNames from 'classnames';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import red from '@material-ui/core/colors/red';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withRouter } from 'react-router';
import { connect } from "react-redux"
import { mapStateToProps,mapDispatchToProps } from '../action.js';
import Api from "~/src/util/apis";
import AwsAuth from '../util/aws'
import Grid from "./SignIn";
import Common from '~/src/util/common'
import store from "../store";
import {compose} from "redux";
import { Link } from 'react-router-dom';


const styles = theme => ({
    contents: {
        margin: '150px auto 0 ',
        maxWidth : 480,
    },
    card: {
        padding : '40px',
        textAlign: 'Center'
    },
    fcButton:{
        width: '200px',
      margin: '40px auto',
    },
    textField : {
        margin: '0 0 40px 0',
    },
    fb:{
        width: '240px',
        margin: '0 auto',
        textAlign: 'center'
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    actions: {
        display: 'flex',
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
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

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user_id: '',
            user_name:'',
            password: '',
            showPassword: false,
            message: [],
            token:''
        };
    };
    componentWillMount = async () =>{
        const _this = this
        await AwsAuth.currentSession().then(
            function(response) {
                _this.props.setCognitoToken(response.session.jwtToken)
            }
        );
    };
    setStoreToken = async ()=> {
        const _this = this

        //ログインユーザ情報を取得
        let params = new URLSearchParams();
        params.set('user_id', this.state.user_id);

        await Api.existsUser(params).then(
            function(response){
                //ログインが成功するとユーザidをstoreに保存する
                alert(response.user.user_id)
                _this.props.setUserId(response.user.user_id)
                _this.props.setProfile(response.user.profile)
                _this.props.setSkill(response.user.skill)

            }
        );
        await AwsAuth.currentSession().then(
            function(response) {
                _this.props.setCognitoToken(response.session.jwtToken)
                _this.goNext()
            }
        );
    };
    handleToAboutPage (){
        this.props.history.push('/profile/input')
    };
    handleChange = prop => event => {
        this.setState({ [prop]: event.target.value });
    };
    handleClickShowPassword = () => {
        this.setState(state => ({ showPassword: !state.showPassword }));
    };
    goError = async (e) => {
        await this.setState(
            {errors: (e.message || JSON.stringify(e))}
        )
        await console.log(this.state.errors)
    };
    goNext = async () => {
        try{
            await this.setState()
            await this.props.history.push({
                pathname: '/',
                state:{
                    mail: this.state.mail,
                    password: this.state.password,
                    email: this.state.email
                }
            })
        } catch (e){
            this.goError(e)
        }
    };

    onLogin = async () => {
        // e.preventDefault();
        await this.setState({ message: [] });

         if (!this.state.user_id) {
            await this.setState({
                message: this.state.message.concat('ユーザ名は必須です')
            })
        }
        if (!this.state.password) {
            await this.setState({
                message: this.state.message.concat('パスワードは必須です')
            })
        }
        await AwsAuth.doLogin(this.state.user_id, this.state.password).then(this.setStoreToken).then(this.goNext).catch(this.goError)
    };
    onSignIn = () => {
        this.props.history.push('/signin')
    };

    forgotPassword = async() =>{
        await AwsAuth.forgotPass(this.state.user_id)
            .then(
                function(response) {
                    console.log(response)
                }
            )
            .catch(
                function(err) {
                    console.log(err.code)
                    if(err.code == 'LimitExceededException'){
                        alert("パスワード再設定操作がロックされました。\n少し時間を置いてから再度行ってください。")
                    }
                }
            )
    };

    render() {
        const { classes } = this.props;

        return (
            <MuiThemeProvider theme={typographyV1Theme}>
            <div className={classNames(classes.contents)}>
                {/*<Typography component="h2" variant="display1" gutterBottom>*/}
                    {/*Display 1*/}
                {/*</Typography>*/}
                <Card className={classes.card}>
                    <TextField
                        id="outlined-adornment-weight"
                        className={classNames(classes.margin, classes.textField)}
                        variant="outlined"
                        label="アカウント"
                        defaultValue={this.state.user_id}
                        onChange={this.handleChange('user_id')}
                        fullWidth
                    />
                    <TextField
                        id="outlined-adornment-password"
                        className={classNames(classes.margin, classes.textField)}
                        variant="outlined"
                        type={this.state.showPassword ? 'text' : 'password'}
                        label="Password"
                        defaultValue={this.state.password}
                        onChange={this.handleChange('password')}
                        helperText="半角英数字"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="Toggle password visibility"
                                        onClick={this.handleClickShowPassword}
                                    >
                                        {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        fullWidth
                    />
                    <Button variant="contained" color="primary" onClick={this.onLogin.bind(this)} fullWidth>
                        ログイン
                    </Button>
                    <Button variant="contained" color="primary" onClick={this.onSignIn.bind(this)} fullWidth>
                        新規登録
                    </Button>
                    <Link onClick={this.forgotPassword.bind(this)} >パスワードを忘れた</Link>
                    <div>
                        {this.state.message.map(
                            function (val,i){return(
                                <p style={{color:'red',textAlign:'center',fontSize:'10px'}} key={i}>{val}</p>
                            )}
                        )}
                    </div>
                </Card>
                {this.state.errors}
                <div className={classes.fb}>
                    <Button variant="contained" color="primary" className={classes.fcButton} onClick={this.handleToAboutPage}>
                        facebookでログイン
                    </Button>
                </div>
            </div>
            </MuiThemeProvider>
        );

    }
}

Login.propTypes = {
     classes: PropTypes.object.isRequired,
};
export default compose(
    withStyles(styles),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(Login)