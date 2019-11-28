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
import ProfileEdit from '../component/ProfileEdit_bk'
import DialogContent from "@material-ui/core/DialogContent";


const styles = theme => ({
    contents: {
        margin: '150px auto 0 ',
        maxWidth : '1260px',
    },
    formContents:{
        margin: '0 auto',
        maxWidth: '640px'
    },
    formControl:{
        display:'block',
        width:'100%'
    },
    chip: {
        margin: theme.spacing.unit / 4,
    },
    myClass: {
        width: '100% !important'
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

class ProfileInput extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user_id:'',

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
                pathname: '/',
                state:{
                    // user_name: this.state.user_id,
                    // email: this.state.email
                }
            })
        } catch (e){
            this.goError(e)
        }
    };

    render() {
        const { classes,dispatchAddValue } = this.props;
        return (
            <MuiThemeProvider theme={typographyV1Theme}>
                <AppBar color="primary">
                    <Header/>
                </AppBar>
                <div className={classes.contents}>
                    <p>プロフィールを入力してください</p>
                </div>
                <Grid container spacing={0} justify={"center"}>
                    <Grid item xs={12} sm={12} key={1} lg={6}>
                        {/*<ProfileEdit goNext={this.goNext}/>*/}
                    </Grid>
                </Grid>
            </MuiThemeProvider>
        );

    }}

ProfileInput.propTypes = {
    classes: PropTypes.object.isRequired,
};
 // export default withStyles(styles)(InputProfile);
export default compose(
    withStyles(styles),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(ProfileInput)