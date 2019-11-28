import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import store from "../store";
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        padding:20
    },
    formControl: {
        margin: theme.spacing.unit,
        maxWidth: '100%'
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: theme.spacing.unit / 4,
    },
    noLabel: {
        marginTop: theme.spacing.unit * 3,
    },

});

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

class SkillSelect extends React.Component {
    constructor(props){
        super(props);
        this.type = this.props.type
        this.names =[];
        this.state = {
            skill: {lang:[],server:[],infrastructure:[]},
        };

        switch (this.props.type) {
            case 'lang':
                this.names = [
                    'PHP',
                    'Java',
                    'Python',
                    'Ruby',
                    'Scala',
                    'Go',
                    'Javascript',
                    'HTML',
                    'CSS',
                ];
            break;
            case 'server':
                this.names =[
                    'EC2',
                    'RDS',
                    'apache',
            ];
                break;
            case 'infrastructure':
                this.names =[
                    'IP',
                    'ネットワーク管理',
                    'セキュリティ管理',
                ];
                break;

        }
    }
    getStyles(name, that) {

        return {
            fontWeight:
                that.state.skill[this.type].indexOf(this.names) === -1
                    ? that.props.theme.typography.fontWeightRegular
                    : that.props.theme.typography.fontWeightMedium,
        };
    }

    componentWillMount(){
        const cloneSkillLang= Object.assign({},store.getState().skill[this.type]);
        let j =0;
        for(let val in cloneSkillLang){
            this.state.skill[this.type][j] = cloneSkillLang[j]
            j++;
        }
    }
    handleChange = async event => {
        const cloneSkillServer = store.getState().skill.server,
              cloneSkillInfrastructure = store.getState().skill.infrastructure,
              cloneSkillLang =  store.getState().skill.lang,
              cloneSkillDetail =  store.getState().skill.detail

        switch(this.type) {
            case 'lang':
                await this.setState({
                    skill:{
                        lang:event.target.value,
                        server:cloneSkillServer,
                        infrastructure:cloneSkillInfrastructure,
                        detail:cloneSkillDetail
                }});
                break;
            case 'server':
                await this.setState({
                    skill:{
                        server:event.target.value,
                        lang:cloneSkillLang,
                        infrastructure:cloneSkillInfrastructure,
                        detail:cloneSkillDetail

                    }});
                break;

            case 'infrastructure':
                await this.setState({
                    skill:{
                        infrastructure:event.target.value,
                        lang:cloneSkillLang,
                        server:cloneSkillServer,
                        detail:cloneSkillDetail
                    }});
                break;

            default:
        }
        await this.props.setSkill(
            this.state.skill.lang,
            this.state.skill.server,
            this.state.skill.infrastructure,
            this.state.skill.detail
        )
    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root} >
                
                <Grid container spacing={24}>
                <FormControl className={classes.formControl} fullWidth>
                    <InputLabel htmlFor="select-multiple-chip">スキル</InputLabel>
                    <Select
                        fullWidth
                        multiple
                        value={this.state.skill[this.type]}
                        onChange={this.handleChange}
                        input={<Input id="select-multiple-chip" />}
                        renderValue={selected => (
                            <div className={classes.chips}>
                                {selected.map(value => (
                                    <Chip key={value} label={value} className={classes.chip} />
                                ))}
                            </div>
                        )}
                        MenuProps={MenuProps}
                    >
                        {this.names.map(name => (
                            <MenuItem key={name} value={name} style={this.getStyles(name, this)}>
                                {name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                </Grid>
            </div>

        );
    }
}

SkillSelect.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(SkillSelect);
