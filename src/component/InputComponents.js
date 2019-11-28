import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import store from "~/src/store";
import Grid from '@material-ui/core/Grid';


const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        // margin: theme.spacing.unit,
        minWidth: 120,
        maxWidth: 300,
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        // margin: this.props.theme.spacing.unit / 4,
    },
    noLabel: {
        // marginTop: theme.spacing.unit * 3,
    },
});

const classes = styles();


class GenderField extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            expanded: false,
            amount: '',
            password: '',
            weight: '',
            showPassword: false,

        };
    }
    handleChange = async event => {
        const cloneProfile = Object.assign({},store.getState().profile);
        cloneProfile[event.target.name] = event.target.value;

        //stateにセット
        await this.setState(
            {"profile":cloneProfile}
        );
        //stateをstoreに保存
        await this.props.setProfile(cloneProfile)
    };


    render(){
        const currencies = [
            {
                value: '1',
                label: '男性',
            },
            {
                value: '0',
                label: '女性',
            }
        ];

        return(
            <TextField
                id="standard-select-currency"
                select
                label="性別"
                className={classes.textField}
                name="gender"
                value={this.props.gender}
                onChange={this.handleChange}
                SelectProps={{
                    MenuProps: {
                        className: classes.menu,
                    },
                }}
                // helperText="Please select your currency"
                margin="normal"
            >
                {currencies.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
        )
    }
}

class BirthDayField extends React.Component{
    constructor(props) {
        super(props);
        this.state = {};
    }
    handleChange = async event => {
        const cloneProfile = Object.assign({},store.getState().profile);
        cloneProfile['basic_info'][event.target.name] = event.target.value;

        //stateにセット
        await this.setState(
            {"profile":cloneProfile}
        );
        //stateをstoreに保存
        await this.props.setProfile(cloneProfile)
    };

    render(){
        var this_year  = new Date().getFullYear();
        const year_list = [];
        for(let i=(this_year-50); i<this_year-18; i++){
            year_list.push(
                {value:i, label:i}
            )
        }
        const month_list = [];
        for(let i=1; i<=12; i++){
            month_list.push(
                {value:i, label:i}
            )
        }

        const day_list = [];
        for(let i=1; i<=31; i++){
            day_list.push(
                {value:i, label:i}
            )
        }
        return(
            <Grid container spacing={16}>
                <Grid item xs={12} sm={12} lg={4} key={1} >
                    <TextField
                        id="standard-select-currency"
                        select
                        label="年"
                        name="year"
                        className={classes.textField}
                        value={this.props.year}
                        onChange={this.handleChange}
                        SelectProps={{
                            MenuProps: {
                                className: classes.menu,
                            },
                        }}
                        // helperText="Please select your currency"
                        margin="normal"
                        fullWidth={true}
                        variant="outlined"
                    >
                        {year_list.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={12} lg={4} key={1}>
                    <TextField
                        id="standard-select-currency"
                        select
                        label="月"
                        name="month"
                        className={classes.textField}
                        value={this.props.month}
                        onChange={this.handleChange}
                        SelectProps={{
                            MenuProps: {
                                className: classes.menu,
                            },
                        }}
                        // helperText="Please select your currency"
                        margin="normal"
                        fullWidth={true}
                        variant="outlined"

                    >
                        {month_list.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={12} lg={4} key={1}>
                    <TextField
                        id="standard-select-currency"
                        select
                        label="日"
                        name="day"
                        className={classes.textField}
                        value={this.props.day}
                        onChange={this.handleChange}
                        SelectProps={{
                            MenuProps: {
                                className: classes.menu,
                            },
                        }}
                        // helperText="Please select your currency"
                        fullWidth={true}
                        margin="normal"
                        variant="outlined"
                    >
                        {day_list.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
            </Grid>
        )
    }
}
class SkillDetail extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            skill: {lang:[],server:[],infrastructure:[],detail:""},
        };
        this.type = this.props.type

    }
    componentWillMount(){
        console.log(store.getState().skill[this.type])
        this.state.skill[this.type] = store.getState().skill[this.type];
    }

    handleChange = async event => {
        const cloneSkillServer = store.getState().skill.server,
            cloneSkillInfrastructure = store.getState().skill.infrastructure,
            cloneSkillLang =  store.getState().skill.lang
        await this.setState({
            skill:{
                detail:event.target.value,
                server:cloneSkillServer,
                infrastructure:cloneSkillInfrastructure,
                lang:cloneSkillLang
            }});
        console.log(this.state)
        await this.props.setSkill(
            this.state.skill.lang,
            this.state.skill.server,
            this.state.skill.infrastructure,
            this.state.skill.detail
        )

    };

    render() {

        return (
            <form className={classes.container} noValidate autoComplete="off">

                <TextField
                    id="outlined-multiline-static"
                    label="経歴詳細"
                    multiline
                    fullWidth
                    style={{ padding: 8 }}
                    rows="12"
                    className={classes.textField}
                    onChange={this.handleChange}
                    name="skill_detail"
                    margin="normal"
                    variant="outlined"
                    value={this.state.skill[this.type]}
                />
            </form>
        );
    }
}


export {GenderField,BirthDayField,SkillDetail}
