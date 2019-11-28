import React from 'react';
import PropTypes from 'prop-types';
import { withStyles,createMuiTheme,MuiThemeProvider} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { connect } from "react-redux"
import { mapStateToProps,mapDispatchToProps } from '../action.js';
import { compose } from 'redux'
import {SkillDetail} from '../component/InputComponents'
import MultipleSelect from '../component/SkillSelect'
import Header from '../component/Header'
import AppBar from '@material-ui/core/AppBar';
import { theme } from '../theme/theme';
import store from "../store";
import Api from "../util/apis";

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

class InputSkill extends React.Component {
    state = {
        name: [],
    };
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleToAboutPage = () => {

        // this.props.setProfile(this.state.profile)
        // this.props.history.push('/about')
    };
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
                    user_name: this.state.user_name,
                    email: this.state.email
                }
            })
        } catch (e){
            this.goError(e)
        }
    };
    skillRegister = async() =>{
        let params = new URLSearchParams();
        params.set('user_id', store.getState().user_id);
        params.set('skill', JSON.stringify(store.getState().skill));

        await Api.postSkill(params).then(
            await function(response) {
                console.log("skillset:"+response.status)
            },
        ).then(
            this.goNext
        ).catch(this.goError)
    }

    render() {
        const { classes,dispatchAddValue } = this.props;
        return (

            <MuiThemeProvider theme={typographyV1Theme(theme)} >
                <AppBar color="primary">
                    <Header/>
                </AppBar>
                <div className={classes.contents}>
                <div className={classes.formContents}>
                    <MultipleSelect type="lang" defaultValue={this.props.lang} setSkill={this.props.setSkill} className="myClass" />
                    <MultipleSelect type="server" defaultValue={this.props.server} setSkill={this.props.setSkill} className="myClass" />
                    <MultipleSelect type="infrastructure" defaultValue={this.props.infrastructure} setSkill={this.props.setSkill} className="myClass" />
                    <SkillDetail type="detail" defaultValue={this.props.detail} setSkill={this.props.setSkill}/>
                    <div className={classes.fb}>
                        <Button variant="contained" color="" className={classes.fcButton} onClick={this.skillRegister}>
                            確認
                        </Button>
                    </div>
                </div>
            </div>
            </MuiThemeProvider>
        );

    }
}

InputSkill.propTypes = {
    classes: PropTypes.object.isRequired,
};
 // export default withStyles(styles)(InputProfile);
export default compose(
    withStyles(styles),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(InputSkill)