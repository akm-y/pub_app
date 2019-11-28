import React from 'react';
import PropTypes from 'prop-types';
import { withStyles,createMuiTheme,MuiThemeProvider} from '@material-ui/core/styles';
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
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import Switch from '@material-ui/core/Switch';
import green from '@material-ui/core/colors/green';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import Chip from '@material-ui/core/Chip';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button'
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import NavigationIcon from '@material-ui/icons/Navigation';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FilledInput from '@material-ui/core/FilledInput';
import Api from "../util/apis";
import ProfileBasicEdit from '../component/ProfileBasicEdit'
import ProfileKibouWorkEdit from '../component/ProfileKibouWorkEdit'
import ProfileNowWorkEdit from '../component/ProfileNowWorkEdit'
import ProfileCareerEdit from '../component/ProfileCareerEdit'

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

const styles = theme => ({
    root: {
        color: green[600],
        '&$checked': {
            color: green[500],
        },
    },
    checked: {},
    card: {
        minWidth: 275,
        marginBottom:"40px"
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

class ProfileEdit_bk extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }
    componentWillMount = async()=> {

        if (this.state.career.length >= 1){
            //経歴追加用のIDを管理する
            //現在のIＤを取得
            let tempIdList = [];
            this.state.career.map((data) => {
                tempIdList.push(data.id)
            });
            let maxId = Math.max.apply(null, tempIdList);
            this.setState({
                careerId:maxId
            })
        } else {
            await this.setState({
                career:[{id:this.state.careerId, start:"2019-01-01", end:"2019-01-01", text:""}]
            });
            await this.setStore("career", this.state.career)

        }
    };
    getStyles(name, that){
        return {
            fontWeight:
                that.state.work_category.indexOf(name) === -1
                    ? that.props.theme.typography.fontWeightRegular
                    : that.props.theme.typography.fontWeightMedium,
        };
    };
    handleChangeCareer = async  event =>{
        let value = event.target.value;
        let name  = event.target.name;
        let id　　 = event.target.id;
        let career = this.state.career;
        await console.log(career);

        career[id][name] = value;
        await this.setState({ "career":career});
        await this.setStore("career", career);
        await console.log(career)

    };
    handleChangeSelectList = async event =>{
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });
        await this.setStore(name, value)

    };

    setStore = async (name, value) =>{
        const cloneProfile = Object.assign({},store.getState().profile);
        cloneProfile[name] = value;

        //stateにセット
        await this.setState(
            {"profile":cloneProfile}
        );
        //stateをstoreに保存
        console.log(cloneProfile);
        await this.props.setProfile(cloneProfile)
    };
    photoRegister = async() =>{
        let params = new URLSearchParams();
        params.set('user_id', store.getState().user_id);
        params.set('user_photo', store.getState().user_photo);

        await Api.postUserPhoto(params).then(
            await function(response) {
                console.log(response)
            },
        ).then(
            this.props.goNext()
        ).catch(
            this.goError
        )
    }
    profileRegister = async() =>{
        let params = new URLSearchParams();
        params.set('user_id', store.getState().user_id);
        params.set('profile', JSON.stringify(store.getState().profile));


        await Api.postProfile(params).then(
            await function(response) {
                console.log(response)
            },
        ).then(
            this.props.goNext()
        ).catch(
            this.goError
        )
    }

    addRow = async() =>{
        await this.careerIdCountUp();

        await this.setState((prevState) => ({
            career: ((prevState) => {
                if (!prevState.career) {
                    prevState.career = []
                }
                prevState.career.push({ id: this.state.careerId, start: '' });
                return prevState.career
            })(prevState)
        }));
    };
    careerIdCountUp = async()=>{
        let next = this.state.careerId + 1;
        await this.setState({
            careerId:next
        })
    };
    CareerForm(val, key) {
        const { classes } = this.props;
        return(
            <Grid container className={classes.career}  item xs={12} lg={11}>
                <Grid item xs={12} lg={2} container justify="center">
                    <p>経歴{val.id}</p>
                </Grid>
                <Grid item xs={12} lg={10} justify="center" container>
                    <Grid item xs={12} lg={6}>
                        <form className={classes.container} noValidate>
                            <TextField
                                name="start"
                                date={val.start}
                                id={key}
                                onChange={this.handleChangeCareer}
                                label="開始"
                                type="date"
                                defaultValue={(val.start)?val.start:"2019-01-01"}
                                fullWidth={true}
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                margin="normal"
                                variant="outlined"
                            />
                        </form>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <form className={classes.container} noValidate>
                            <TextField
                                name="end"
                                date={val.end}
                                id={key}
                                onChange={this.handleChangeCareer}
                                label="終了"
                                type="date"
                                defaultValue={(val.end)?val.end:"2019-01-01"}
                                fullWidth={true}
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                margin="normal"
                                variant="outlined"
                            />
                        </form>
                    </Grid>
                    <Grid item xs={12} lg={12}>
                        <form className={classes.container} noValidate>
                            <TextField
                                name="company"
                                id={key}
                                onChange={this.handleChange}
                                label="業種"
                                defaultValue={(val.company)?val.company:""}
                                fullWidth={true}
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                margin="normal"
                                variant="outlined"
                            />
                        </form>
                    </Grid>
                    <Grid item xs={12} lg={12}>
                        <form className={classes.container} noValidate>
                            <TextField
                                name="position"
                                id={key}
                                onChange={this.handleChange}
                                label="ポジション"
                                defaultValue={(val.postion)?val.postion:""}
                                fullWidth={true}
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                margin="normal"
                                variant="outlined"
                            />
                        </form>
                    </Grid>
                    <Grid item xs={12} lg={12}>
                    <form className={classes.container} noValidate>
                        <TextField
                            id={key}
                            name="text"
                            label={"経歴"+val.id}
                            defaultValue={val.text}
                            onBlur={this.handleChangeCareer}
                            multiline
                            rows="10"
                            fullWidth={true}
                            className={classes.textField}
                            margin="normal"
                            variant="outlined"
                        />
                    </form>
                </Grid>
                </Grid>
            </Grid>
        )
    }
    render() {
        const { classes,dispatchAddValue } = this.props;
        const ITEM_HEIGHT = 48;
        const ITEM_PADDING_TOP = 8;
        const MenuProps = {
            PaperProps: {
                style: {
                    maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                    width: 250,
                },
            },
        };
        return (
            <Grid item xs={12} md={12} sm={12} lg={12} container
                  justify="center"
                  alignItems="center"
            >
                <Card className={classes.card}>
                    <CardContent>
                        <ProfileBasicEdit profileRegister={this.profileRegister} photoRegister={this.photoRegister}/>
                    </CardContent>
                </Card>
                <Card className={classes.card}>
                    <CardContent>
                        <ProfileKibouWorkEdit profileRegister={this.profileRegister}/>
                    </CardContent>
                </Card>
                <Card className={classes.card}>
                    <CardContent>
                        <ProfileNowWorkEdit profileRegister={this.profileRegister}/>
                    </CardContent>
                </Card>
                <Card className={classes.card}>
                    <CardContent>
                        <ProfileCareerEdit profileRegister={this.profileRegister}/>
                    </CardContent>
                </Card>
                <div>
                    <Fab color="secondary" aria-label="Add" className={classes.margin} onClick={() => this.addRow()}>
                        <AddIcon />
                    </Fab>
                </div>
                {/*<Fab variant="extended" color="primary" aria-label="Add" className={classes.margin}　onClick={() => this.profileRegister()}>*/}
                {/*    <NavigationIcon className={classes.extendedIcon} />*/}
                {/*    更新する*/}
                {/*</Fab>*/}
            </Grid>
        );

    }}

ProfileEdit_bk.propTypes = {
    classes: PropTypes.object.isRequired,
};
 // export default withStyles(styles)(InputProfile);
export default compose(
    withStyles(styles,{ withTheme: true }),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(ProfileEdit_bk)