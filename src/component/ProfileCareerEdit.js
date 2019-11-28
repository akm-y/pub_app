import React from 'react';
import PropTypes from 'prop-types';
import { withStyles,createMuiTheme,MuiThemeProvider} from '@material-ui/core/styles';
import { connect } from "react-redux"
import { mapStateToProps,mapDispatchToProps } from '../action.js';
import { compose } from 'redux'
import store from '../store'
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import green from '@material-ui/core/colors/green';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import NavigationIcon from '@material-ui/icons/Navigation';

const styles = theme => ({
    root: {
        color: green[600],
        '&$checked': {
            color: green[500],
        },
        textField:{
          backgroundColor:'gray'
        }
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

class ProfileCareerEdit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            //TODO storeから取得　なければサーバから通信
            career:('career' in store.getState().profile)? store.getState().profile.career: [],
            careerId:1

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

        career[id][name] = value;
        await this.setState({ "career":career});
        await this.setStore("career", career);
        await console.log(career)

    };

    saveProfile = async() =>{
        //setStore
        await this.setStore("career",this.state.career)

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

    addRow = async() =>{
        await this.careerIdCountUp();

        await alert("next"+this.state.careerId);
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
            
                <div className={classes.root}>
                    <Grid container justify="center">
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <p>経歴{val.id}</p>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <Grid container justify="flex-start"　spacing={1}>
                                    <Grid item sm={12} md={6} lg={6}>
                                        <form className={classes.container} noValidate>
                                        <TextField
                                            name="start"
                                            date={val.start}
                                            id={key}
                                            onBlur={this.handleChangeCareer}
                                            label="開始"
                                            type="date"
                                            defaultValue={(val.start)?val.start:""}
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
                                    <Grid item sm={12} md={6} lg={6}>
                                        <form className={classes.container} noValidate>
                                        <TextField
                                            name="end"
                                            date={val.end}
                                            id={key}
                                            onBlur={this.handleChangeCareer}
                                            label="終了"
                                            type="date"
                                            defaultValue={(val.end)?val.end:""}
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
                                </Grid>
                                <Grid item xs={12} lg={12}>
                                    <form className={classes.container} noValidate>
                                        <TextField
                                            name="company"
                                            id={key}
                                            onBlur={this.handleChangeCareer}
                                            label="勤務先"
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
                                            name="job"
                                            id={key}
                                            onBlur={this.handleChangeCareer}
                                            label="職種"
                                            defaultValue={(val.job)?val.job:""}
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
                                            onBlur={this.handleChangeCareer}
                                            label="ポジション"
                                            defaultValue={(val.position)?val.position:""}
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
                    </Grid>
                </div>
        )
    }
    render() {
        const { classes,dispatchAddValue } = this.props;
        const ITEM_HEIGHT = 48;
        const ITEM_PADDING_TOP = 8;

        return (
            <Grid container justify="center" alignItems="center">
                <Grid item xs={12} md={12} sm={11} lg={12} container >
                    <Grid container spacing={16}
                              justify="center"
                              alignItems="left"
                              className={classes.list}
                        >
                        <Grid item xs={12} sm={12} md={12} lg={11} justify="flex-start" container>
                            これまでの経験
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                            {this.state.career && this.state.career.map(
                                (val,key) =>
                                this.CareerForm(val, key)
                            )}
                        </Grid>
                     </Grid>
              </Grid>

                <div>
                    <Fab color="secondary" aria-label="Add" className={classes.margin} onClick={() => this.addRow()}>
                        <AddIcon />
                    </Fab>
                </div>
            </Grid>
        );

    }}

ProfileCareerEdit.propTypes = {
    classes: PropTypes.object.isRequired,
};
 // export default withStyles(styles)(InputProfile);
export default compose(
    withStyles(styles,{ withTheme: true }),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(ProfileCareerEdit)