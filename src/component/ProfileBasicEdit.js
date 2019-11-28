import React from 'react';
import PropTypes from 'prop-types';
import { withStyles,createMuiTheme,MuiThemeProvider} from '@material-ui/core/styles';
import { connect } from "react-redux"
import { mapStateToProps,mapDispatchToProps } from '../action.js';
import FormControl from '@material-ui/core/FormControl';
import { compose } from 'redux'
import store from '../store'
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import purple from '@material-ui/core/colors/purple';
import InputBase from '@material-ui/core/InputBase';

const BootstrapInput = withStyles(theme => ({
    root: {
        'label + &': {
            marginTop: theme.spacing.unit * 3,
        },
    },
    input: {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #ced4da',
        fontSize: 16,
        width: 'auto',
        padding: '10px 26px 10px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            borderRadius: 4,
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
}))(InputBase);

const styles = theme => ({
    root: {
        flexGrow: 1,
        margin:'0 auto',
        maxWidth : '1260px',
        // [theme.breakpoints.down('sm')]: {
        //     width:'640px'
        // },
        // [theme.breakpoints.up('sm')]: {
        //     width:'960px'
        // },

    },
    name:{
        flexGrow: 1,
    },
    checked: {},
    contents: {
        margin: '150px auto 0 ',
        maxWidth : '1260px',
    },
    formContents:{
        margin: '0 auto',
        // maxWidth: '640px'
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
    textFieldBirthDay: {
        marginLeft: 8,
        // marginRight: theme.spacing.unit,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: 20
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
    },
    card: {
        minWidth: 275,
    },
    cssLabel: {
        '&$cssFocused': {
            color: purple[500],
        },
    },
    cssFocused: {},
    cssUnderline: {
        '&:after': {
            borderBottomColor: purple[500],
        },
    },
    cssOutlinedInput: {
        '&$cssFocused $notchedOutline': {
            borderColor: purple[500],
        },
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

class ProfileBasicEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //TODO storeから取得　なければサーバから通信
            basic_info:store.getState().profile.basic_info,
            career:('career' in store.getState().profile)? store.getState().profile.career: [],
            photo:"",
            careerId:1

        }
        this.onImageSelected = this.onImageSelected.bind(this);

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
            await this.setStore("basic_info", this.state.basic_info)

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
    handleChange = async (event) => {
        let basic_info = this.state.basic_info
        let name = event.target.name;
        let value = event.target.value;
        basic_info[name] = value
        await this.setState({
            basic_info: basic_info,
        });
        await this.setStore("basic_info", basic_info);

    };

    handleChangeJobStatus = async event => {
        let basic_info = this.state.basic_info
        let name = event.target.name;
        basic_info[name] = !this.state.basic_info.job_status;
        this.setState( {basic_info: basic_info});
    };
    setStore = async (name, value) =>{
        const cloneProfile = Object.assign({},store.getState().profile);
        cloneProfile[name] = value;

        //stateにセット
        await this.setState(
            {"profile":cloneProfile}
        );
        //stateをstoreに保存
        await this.props.setProfile(cloneProfile)
    };
    onImageSelected = async (e)=> {
        const file = await e.target.files[0];
        const fr = await new FileReader();

        let _this = await this
         fr.onload =async (event) => {
            const imgNode = await this.refs.image;
             _this.state.photo = await event.target.result
             imgNode.src = await _this.state.photo;
             await _this.setState({"basic_info":{
                 "user_photo": _this.state.photo
             }})
             await this.props.setUserPhoto(this.state.photo)
         };
        await fr.readAsDataURL(file);


    };

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
        let this_year  = new Date().getFullYear();
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
        return (
            <div className={classes.root}>
                <Grid container justify="center">
                    {/*<Grid item xs={2}>*/}
                        {/*<FormControl className={classes.margin} fullWidth>*/}
                            {/*<span>写真</span>*/}
                        {/*</FormControl>*/}
                    {/*</Grid>*/}
                    <Grid item sm={12} md={12} lg={12}>
                        <Grid container justify="flex-start"　spacing={1}>
                            <Grid item sm={12} md={6} lg={6}>
                                <FormControl className={classes.margin} fullWidth>
                                    <div>
                                        <input type="file" accept="image/*" onChange={this.onImageSelected} />
                                        <p>Image will be previewed here!</p>
                                        <img width="150" height="150" ref="image" src="" />
                                    </div>
                                    <TextField
                                        id="outlined-name"
                                        fullWidth={true}
                                        className={classes.margin}
                                        InputLabelProps={{
                                            classes: {
                                                root: classes.cssLabel,
                                                // focused: classes.cssFocused,
                                            },
                                        }}
                                        InputProps={{
                                            classes: {
                                                root: classes.cssOutlinedInput,
                                                // focused: classes.cssFocused,
                                                notchedOutline: classes.notchedOutline,
                                            },
                                        }}
                                        label="姓"
                                        variant="outlined"
                                        // id="custom-css-outlined-input"
                                        name="first_name"
                                        onBlur={this.handleChange}
                                        defaultValue={this.state.basic_info.first_name}
                                        color={"primary"}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item sm={12} md={6} lg={6}>
                                <FormControl className={classes.margin} fullWidth>
                                    <TextField
                                        fullWidth={true}
                                        variant="outlined"
                                        className={classes.margin}
                                        InputLabelProps={{
                                            classes: {
                                                root: classes.cssLabel,
                                                // focused: classes.cssFocused,
                                            },
                                        }}
                                        InputProps={{
                                            classes: {
                                                root: classes.cssOutlinedInput,
                                                // focused: classes.cssFocused,
                                                notchedOutline: classes.notchedOutline,
                                            },
                                        }}
                                        label="名"
                                        id="custom-css-outlined-input"
                                        onBlur={this.handleChange}
                                        defaultValue={this.state.basic_info.last_name}
                                        name="last_name"
                                        color={"primary"}


                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container justify="flex-start">
                            <Grid item xs={12} sm={12} md={12} lg={12} >
                                <FormControl className={classes.margin} fullWidth>
                                    <TextField
                                        fullWidth={true}
                                        variant="outlined"
                                        id="date"
                                        label="職業"
                                        className={classes.textFieldBirthDay}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        name="job"
                                        onBlur={this.handleChange}
                                        defaultValue={this.state.basic_info.job}
                                        color={"primary"}

                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container justify="flex-start">
                            <Grid item xs={12} sm={12} md={12} lg={12} >
                                <FormControl className={classes.margin} fullWidth>
                                    <TextField
                                        fullWidth={true}
                                        variant="outlined"
                                        id="date"
                                        label="Birthday"
                                        type="date"
                                        className={classes.textFieldBirthDay}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        name="birthday"
                                        onBlur={this.handleChange}
                                        defaultValue={this.state.basic_info.birthday}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container justify="flex-start">
                            <Grid item xs={12} sm={12} md={12} lg={12} >
                                <FormControl className={classes.margin} fullWidth>
                                    <TextField
                                        fullWidth={true}
                                        className={classes.margin}
                                        InputLabelProps={{
                                            classes: {
                                                root: classes.cssLabel,
                                                focused: classes.cssFocused,
                                            },
                                        }}
                                        InputProps={{
                                            classes: {
                                                root: classes.cssOutlinedInput,
                                                focused: classes.cssFocused,
                                                notchedOutline: classes.notchedOutline,
                                            },
                                        }}
                                        label="所在地"
                                        variant="outlined"
                                        id="custom-css-outlined-input"
                                        name="prefecture"
                                        onBlur={this.handleChange}
                                        defaultValue={this.state.basic_info.prefecture}
                                        helperText="東京都渋谷区"
                                    />

                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container justify="flex-start">
                            <Grid item xs={12} sm={12} md={12} lg={12} >
                                <FormControl className={classes.margin} fullWidth>
                                    <TextField
                                        className={classes.margin}
                                        InputLabelProps={{
                                            classes: {
                                                root: classes.cssLabel,
                                                focused: classes.cssFocused,
                                            },
                                        }}
                                        InputProps={{
                                            classes: {
                                                root: classes.cssOutlinedInput,
                                                focused: classes.cssFocused,
                                                notchedOutline: classes.notchedOutline,
                                            },
                                        }}
                                        label="メールアドレス"
                                        variant="outlined"
                                        id="custom-css-outlined-input"
                                        name="mail"
                                        onBlur={this.handleChange}
                                        defaultValue={this.state.basic_info.mail}
                                        fullWidth={true}
                                        helperText="xxxxxx@gmail.com"

                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container justify="flex-start">
                            <Grid item xs={12} sm={12} md={12} lg={12} >
                                <FormControl className={classes.margin} fullWidth>
                                    <TextField
                                        className={classes.margin}
                                        InputLabelProps={{
                                            classes: {
                                                root: classes.cssLabel,
                                                focused: classes.cssFocused,
                                            },
                                        }}
                                        InputProps={{
                                            classes: {
                                                root: classes.cssOutlinedInput,
                                                focused: classes.cssFocused,
                                                notchedOutline: classes.notchedOutline,
                                            },
                                        }}
                                        label="現在の雇用形態"
                                        variant="outlined"
                                        id="custom-css-outlined-input"
                                        name="job_style"
                                        onBlur={this.handleChange}
                                        defaultValue={this.state.basic_info.job_style}
                                        fullWidth={true}
                                        helperText="正社員 | 個人事業主　..."

                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container justify="flex-start">
                            <Grid item xs={12} sm={12} md={12} lg={12} >
                                <FormControl className={classes.margin} fullWidth>
                                    <TextField
                                        className={classes.margin}
                                        InputLabelProps={{
                                            classes: {
                                                root: classes.cssLabel,
                                                focused: classes.cssFocused,
                                            },
                                        }}
                                        InputProps={{
                                            classes: {
                                                root: classes.cssOutlinedInput,
                                                focused: classes.cssFocused,
                                                notchedOutline: classes.notchedOutline,
                                            },
                                        }}
                                        name="memo"
                                        id="custom-css-outlined-input"
                                        label="自己紹介"
                                        multiline
                                        rows="20"
                                        rowsMax="20"
                                        defaultValue={this.state.basic_info.memo}
                                        helperText="hello"
                                        variant="outlined"
                                        fullWidth={true}
                                        onBlur={this.handleChange}
                                />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
                // <Grid item xs={10} sm={10} lg={8} md={8}>
                //     <Card className={classes.card}>
                //         <CardContent>
                //             <div className={classes.root}>
                //                 <Grid container spacing={4}>
                //                     <Grid container spacing={16} lg={11}
                //                           direction="row"
                //                           justify="center"
                //                           alignItems="center"
                //                           className={classes.list}
                //                     >
                //                         <Grid item xs={12} md={12} sm={12} lg={5} cotainer spacong={14}>
                //                             <TextField
                //                                 id="outlined-name"
                //                                 label="姓"
                //                                 variant="outlined"
                //                                 name="first_name"
                //                                 fullWidth
                //                                 onBlur={this.handleChange}
                //                                 defaultValue={this.state.basic_info.first_name}
                //                             />
                //                         </Grid>
                //                         <Grid item xs={12} md={12} sm={12} lg={5}>
                //                             <TextField
                //                                 id="outlined-name"
                //                                 label="名"
                //                                 variant="outlined"
                //                                 name="last_name"
                //                                 fullWidth defaultValue={this.state.basic_info.last_name} onBlur={this.handleChange}
                //                             />
                //                         </Grid>
                //                     </Grid>
                //                 </Grid>
                //             </div>
                //             <Grid item xs={12} md={12} sm={11} lg={11} container spacing={16}>
                //                 <Grid container spacing={16} lg={11}
                //                       direction="row"
                //                       alignItems="center"
                //                       className={classes.list}
                //                 >
                //                     <Grid item xs={12} md={12} sm={12} lg={5} cotainer spacong={14}>
                //                         <TextField
                //                             id="outlined-name"
                //                             label="姓"
                //                             variant="outlined"
                //                             name="first_name"
                //                             fullWidth
                //                             onBlur={this.handleChange}
                //                             defaultValue={this.state.basic_info.first_name}
                //                         />
                //                     </Grid>
                //                     <Grid item xs={12} md={12} sm={12} lg={5}>
                //                         <TextField
                //                                     id="outlined-name"
                //                                     label="名"
                //                                     variant="outlined"
                //                                     name="last_name"
                //                                     fullWidth defaultValue={this.state.basic_info.last_name} onBlur={this.handleChange}
                //                                 />
                //                     </Grid>
                //                 </Grid>
                //                 <Grid item xs={12} md={12} sm={12} lg={12} container >
                //                     <Grid container spacing={16} direction="row"
                //                           justify="center"
                //                           alignItems="center"
                //                           className={classes.list}
                //                     >
                //                         <Grid item xs={12} sm={12} md={10} lg={10}>
                //                             <Grid container spacing={16}>
                //                                     <Grid item xs={12} sm={12} lg={4} key={1} >
                //                                             <TextField
                //                                             id="standard-select-currency"
                //                                             select
                //                                             label="年"
                //                                             name="year"
                //                                             className={classes.textField}
                //                                             value={this.state.basic_info.year}
                //                                             onBlur={this.handleChange}
                //                                             SelectProps={{
                //                                                 MenuProps: {
                //                                                     className: classes.menu,
                //                                                 },
                //                                             }}
                //                                             // helperText="Please select your currency"
                //                                             margin="normal"
                //                                             fullWidth={true}
                //                                             variant="outlined"
                //                                         >
                //                                             {year_list.map(option => (
                //                                                 <MenuItem key={option.value} value={option.value}>
                //                                                     {option.label}
                //                                                 </MenuItem>
                //                                             ))}
                //                                         </TextField>
                //                                     </Grid>
                //                                     <Grid item xs={12} sm={12} lg={4} key={1}>
                //                                         <TextField
                //                                             id="standard-select-currency"
                //                                             select
                //                                             label="月"
                //                                             name="month"
                //                                             className={classes.textField}
                //                                             value={this.state.basic_info.month}
                //                                             onBlur={this.handleChange}
                //                                             SelectProps={{
                //                                                 MenuProps: {
                //                                                     className: classes.menu,
                //                                                 },
                //                                             }}
                //                                             // helperText="Please select your currency"
                //                                             margin="normal"
                //                                             fullWidth={true}
                //                                             variant="outlined"
                //
                //                                         >
                //                                             {month_list.map(option => (
                //                                                 <MenuItem key={option.value} value={option.value}>
                //                                                     {option.label}
                //                                                 </MenuItem>
                //                                             ))}
                //                                         </TextField>
                //                                     </Grid>
                //                                     <Grid item xs={12} sm={12} lg={4} key={1}>
                //                                        <TextField
                //                                             id="standard-select-currency"
                //                                             select
                //                                             label="日"
                //                                             name="day"
                //                                             className={classes.textField}
                //                                             value={this.state.basic_info.day}
                //                                             onBlur={this.handleChange}
                //                                             SelectProps={{
                //                                                 MenuProps: {
                //                                                     className: classes.menu,
                //                                                 },
                //                                             }}
                //                                             // helperText="Please select your currency"
                //                                             fullWidth={true}
                //                                             margin="normal"
                //                                             variant="outlined"
                //                                         >
                //                                             {day_list.map(option => (
                //                                                 <MenuItem key={option.value} value={option.value}>
                //                                                     {option.label}
                //                                                 </MenuItem>
                //                                             ))}
                //                                         </TextField>
                //                                     </Grid>
                //                                 </Grid>
                //                         </Grid>
                //                     </Grid>
                //                 </Grid>
                //                 <Grid item xs={12} md={12} sm={11} lg={11} container >
                //                     <Grid container spacing={24} direction="row"
                //                           justify="center"
                //                           alignItems="center"
                //                           className={classes.list}
                //                     >
                //                         <Grid item xs={12} md={12} sm={12} lg={10} container >
                //                             <Select
                //                             labelId="demo-simple-select-outlined-label"
                //                             id="demo-simple-select-outlined"
                //                             value={this.state.basic_info.gender}
                //                             onBlur={this.handleChange}
                //                             outlined
                //                         >
                //                             <MenuItem value="">
                //                                 <em>未選択</em>
                //                             </MenuItem>
                //                             <MenuItem value={1}>男性</MenuItem>
                //                             <MenuItem value={0}>女性</MenuItem>
                //                             <MenuItem value={9}>その他</MenuItem>
                //                         </Select>
                //                         </Grid>
                //                     </Grid>
                //                 </Grid>
                //                 <Grid item xs={12} md={12} sm={11} lg={11} container >
                //                     <Grid container spacing={16} direction="row"
                //                           justify="center"
                //                           alignItems="center"
                //                           className={classes.list}
                //                     >
                //                         <Grid item xs={9} sm={5} lg={10}>
                //                             <Grid container justify="flex-start">
                //                                 <FormControl className={classes.formControl}>
                //                                     <InputLabel htmlFor="component-simple">都道府県</InputLabel>
                //                                     <Input id="component-simple"  name="prefecture" defaultValue={this.state.basic_info.prefecture} onBlur={this.handleChange} variant="outlined"
                //                                            onKeyUp="AjaxZip3.zip2addr(this,'','addr11','addr11');"/>
                //                                 </FormControl>
                //                             </Grid>
                //                         </Grid>
                //                     </Grid>
                //                 </Grid>
                //                 <Grid item xs={12} md={12} sm={11} lg={11} container >
                //                     <Grid container spacing={16} direction="row"
                //                           justify="center"
                //                           alignItems="center"
                //                           className={classes.list}
                //                     >
                //                         <Grid item xs={12} md={12} sm={12} lg={2} justify="flex-start" container>
                //                             スカウトを受ける
                //                         </Grid>
                //                         <Grid item xs={10} md={10} sm={10} lg={10} justify="flex-start" container>
                //                             <div>
                //                                 <Switch
                //                                     checked={this.state.basic_info.job_status}
                //                                     onBlur={this.handleChangeJobStatus}
                //                                     value="checkedB"
                //                                     color="primary"
                //                                     name="job_status"
                //                                 />
                //                             </div>
                //                         </Grid>
                //                     </Grid>
                //                 </Grid>
                //                 <Grid item xs={12} md={12} sm={12} lg={12} container >
                //                     <Grid container spacing={16} direction="row"
                //                           justify="flex-start"
                //                           alignItems="center"
                //                           className={classes.list}
                //                     >
                //                         <Grid item xs={12} md={12} sm={12} lg={2} justify="flex-start" container>
                //                             自己紹介
                //                         </Grid>
                //                         <Grid item xs={12} lg={10}　sm={12} md={10} justify={"flex-start"}>
                //                             <form className={classes.container} noValidate>
                //                                 <TextField
                //                                     multiple
                //                                     InputProps={{
                //                                         readOnly: false,
                //                                     }}
                //                                     name="memo"
                //                                     label={"紹介"}
                //                                     defaultValue={this.state.basic_info.memo}
                //                                     multiline
                //                                     rows="10"
                //                                     fullWidth={true}
                //                                     className={classes.textField}
                //                                     margin="normal"
                //                                     variant="outlined"
                //                                     onBlur={this.handleChange}
                //                                 />
                //                             </form>
                //                         </Grid>
                //                     </Grid>
                //                 </Grid>
                //             </Grid>
                //             <button onClick={this.saveProfile}>
                //         <Fab variant="extended" color="primary" aria-label="Add" className={classes.margin} >
                //             <NavigationIcon className={classes.extendedIcon} />
                //             更新
                //         </Fab>
                //     </button>
                //         </CardContent>
                //     </Card>
                // </Grid>
        );

    }}

ProfileBasicEdit.propTypes = {
    classes: PropTypes.object.isRequired,
};
 // export default withStyles(styles)(InputProfile);
export default compose(
    withStyles(styles,{ withTheme: true }),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(ProfileBasicEdit)