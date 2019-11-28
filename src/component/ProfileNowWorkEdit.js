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

const styles = theme => ({
    root: {
        color: green[600],
        '&$checked': {
            color: green[500],
        },
    },
    checked: {},
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
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    job_btn:{
        backgroundColor:"#008000!important",
        color:"#ffffff"
    },
    work_style_btn:{
        backgroundColor:"#4169e1!important",
        color:"#ffffff"
    },
    work_category_btn:{
        backgroundColor:"#9932cc!important",
        color:"#ffffff"
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    career:{
        marginBottom:"40px"
    },
    margin: {
        margin: theme.spacing.unit,
    },
    extendedIcon: {
        marginRight: theme.spacing.unit,
    },
    list:{
        marginTop:"5px",
        marginBottom:"5px",
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

class ProfileNowWorkEdit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            //TODO storeから取得　なければサーバから通信

            job_list:[
                {id:1, name: '正社員'},
                {id:2, name: '契約社員'},
                {id:3, name: 'アルバイト・パート'},
                {id:4, name: '請負・業務委託（法人 代表）'},
                {id:5, name: '請負・業務委託（個人事業主）'},
            ],
            work_style_list:[
                {id:1, name: 'フルタイム'},
                {id:2, name: '時短'},
                {id:3, name: '日数限定'},
                {id:4, name: '常駐のみ'},
                {id:5, name: 'リモートのみ'},
                {id:6, name: '常駐 + リモート'}

            ],
            work_category:('work_category' in store.getState().profile)? store.getState().profile.work_category: [],
            work_category_list: [
                {id:1, name: 'Oliver Hansen'},
                {id:2, name: 'Van Henry'},
                {id:3, name: 'April Tucker'},
                {id:4, name: 'Ralph Hubbard'},
                {id:5, name: 'Omar Alexander'},
                {id:6, name: 'Carlos Abbott'},
                {id:7, name: 'Miriam Wagner'},
                {id:8, name: 'Bradley Wilkerson'},
                {id:9, name: 'Virginia Andrews'},
                {id:10, name: 'Kelly Snyder'}
            ],
            now_job:('now_job' in store.getState().profile)? store.getState().profile.now_job: [],
            now_work_style:('now_work_style' in store.getState().profile)? store.getState().profile.now_work_style: [],
            now_work_category:('now_work_category' in store.getState().profile)? store.getState().profile.now_work_category: [],

        }
    }
    componentWillMount = async()=> {
    };
    getStyles(name, that){
        return {
            fontWeight:
                that.state.work_category.indexOf(name) === -1
                    ? that.props.theme.typography.fontWeightRegular
                    : that.props.theme.typography.fontWeightMedium,
        };
    };
    handleChangeSelectList = async event =>{
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });
        // await this.setStore(name, value)

    };
    saveProfile = async() =>{
        //setStore
        await this.setStore("now_job",this.state.now_job);
        await this.setStore("now_work_style",this.state.now_work_style);
        await this.setStore("now_work_category",this.state.now_work_category);

        //setProfile
        await this.props.profileRegister()
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
                <Grid item xs={12} md={12} sm={11} lg={11} container >
                    <Grid container spacing={16} direction="row"
                          justify="flex-start"
                          alignItems="left"
                          className={classes.list}
                    >
                        <Grid item xs={12} md={12} sm={12} lg={2} justify="flex-start" container>
                            現在の契約形態
                        </Grid>
                        <Grid item xs={10} sm={10} lg={10}>
                            <Select
                                fullWidth
                                multiple
                                name={"now_job"}
                                value={this.state.now_job}
                                defaultValue={this.state.now_job}
                                onChange={this.handleChangeSelectList}
                                input={<Input id="select-multiple-chip" />}
                                renderValue={selected => (
                                    <div className={classes.chips}>
                                        {selected.map(value => (
                                            <Chip key={value} label={value} className={classes.chip+" "+classes.job_btn} />
                                        ))}
                                    </div>
                                )}
                                MenuProps={MenuProps}
                            >
                                {this.state.job_list.map((value)=> {
                                    return (
                                        <MenuItem key={value.id} value={value.name} style={this.getStyles(value.name, this)}>
                                            {value.name}
                                        </MenuItem>
                                    )
                                }, this)}
                            </Select>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={12} sm={11} lg={11} container >
                    <Grid container spacing={16} direction="row"
                          justify="flex-start"
                          alignItems="left"
                          className={classes.list}
                    >
                        <Grid item xs={12} md={12} sm={12} lg={2} justify="flex-start" container>
                            現在のワークスタイル
                        </Grid>
                        <Grid item xs={10} sm={10} lg={10}>
                            <Select
                                fullWidth
                                multiple
                                name={"now_work_style"}
                                value={this.state.now_work_style}
                                defaultValue={this.state.now_work_style}
                                onChange={this.handleChangeSelectList}
                                input={<FilledInput name="age" id="filled-age-native-simple" />}
                                renderValue={selected => (
                                    <div className={classes.chips}>
                                        {selected.map(value => (
                                            <Chip key={value} label={value} className={classes.chip+" "+classes.work_style_btn} />
                                        ))}
                                    </div>
                                )}
                                MenuProps={MenuProps}
                            >
                                {this.state.work_style_list.map((value)=> {
                                    return (
                                        <MenuItem key={value.id} value={value.name} style={this.getStyles(value.name, this)} >
                                            {value.name}
                                        </MenuItem>
                                    )
                                }, this)}
                            </Select>

                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={12} sm={11} lg={11} container >
                    <Grid item xs={12} md={12} sm={11} lg={11} container >
                        <Grid container spacing={16} direction="row"
                              justify="flex-start"
                              alignItems="left"
                              className={classes.list}
                        >
                            <Grid item xs={12} md={12} sm={12} lg={2} justify="flex-start" container>
                                現在の仕事内容
                            </Grid>
                            <Grid item xs={10} sm={10} lg={10}>
                                <Select
                                    fullWidth
                                    multiple
                                    name={"now_work_category"}
                                    value={this.state.now_work_category}
                                    defaultValue={this.state.now_work_category}
                                    onChange={this.handleChangeSelectList}
                                    input={<Input id="select-multiple-chip" />}
                                    renderValue={selected => (
                                        <div className={classes.chips}>
                                            {selected.map(value => (
                                                <Chip key={value} label={value} className={classes.chip+" "+classes.work_category_btn} />
                                            ))}
                                        </div>
                                    )}
                                    MenuProps={MenuProps}
                                >
                                    {this.state.work_category_list.map((value)=> {
                                        return (
                                            <MenuItem key={value.id} value={value.name} style={this.getStyles(value.name, this)}>
                                                {value.name}
                                            </MenuItem>
                                        )
                                    }, this)}
                                </Select>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <button onClick={this.saveProfile}>
                    <Fab variant="extended" color="primary" aria-label="Add" className={classes.margin} >
                        <NavigationIcon className={classes.extendedIcon} />
                        更新
                    </Fab>
                </button>
            </Grid>
        );

    }}

ProfileNowWorkEdit.propTypes = {
    classes: PropTypes.object.isRequired,
};
 // export default withStyles(styles)(InputProfile);
export default compose(
    withStyles(styles,{ withTheme: true }),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(ProfileNowWorkEdit)