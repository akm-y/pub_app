import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import classNames from "classnames";
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Grid from '@material-ui/core/Grid';
import FriendList from '~src/component/FriendList'
import green from '@material-ui/core/colors/green';
import Radio from '@material-ui/core/Radio';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import {compose} from "redux";
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps} from "../action";

const avaterIconSize = 80
const styles = theme => ({
    root: {
        width: '100%',
    },
    content: {
        flexGrow: 1,
        width : 640,
        marginTop: 60,
        margin: '0 auto',
    },
    appBar: {
        position: 'relative',
    },
    flex: {
        flex: 1,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width:640,
    },
    gridRight:{
        [theme.breakpoints.down('sm')]: {
            display:'none',
            backgroundColor: 'red'
        }
    },
    green: {
        color: green[400],
        '&$checked': {
            color: green[600],
        },
    },
    bigAvatarWrap:{
        display:'flex',
        justifyContent:'center',
        height:avaterIconSize
    },
    bigAvatar: {
        margin: 10,
        width: avaterIconSize,
        height: avaterIconSize,
    },
    selectedFriend:{
        borderBottom: 'solid 1px blue',
        paddingBottom: 8,
        marginBottom: 20
    },
    selectedFriendAName:{
        display:'flex',
        justifyContent:'flex-end',
        height:40,
        alignItems:'flex-end'
    },
    iconConnect:{
        display:'flex',
        // alignItems:'center',
        position: 'relative',
        top: 50,
        justifyContent:'center'

    },
    checked: {},
});

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class intro extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            multiline: 'Controlled',
            from:[],
            to:[],
            friendA:['a'],
            friendB:['b']
        }
    };

    handleRadioChangeA = async val =>{
        await this.setState({from:val})
        await console.log("from:"+this.state.from.profile.basic_info.last_name)
    };
    handleRadioChangeB = async val =>{
        await this.setState({to:val})
        await console.log("from:"+this.state.to.profile.last_name)
    };
    render() {
        const { classes } = this.props;
        return (
            <div>
                {/*<div onClick={this.handleClickOpen}>*/}
                    {/*<SupervisedUserCircleIcon />*/}
                {/*</div>*/}
                {/*<Dialog*/}
                    {/*fullScreen*/}
                    {/*open={this.state.open}*/}
                    {/*onClose={this.handleClose}*/}
                    {/*TransitionComponent={Transition}*/}
                {/*>*/}
                    {/*<AppBar className={classes.appBar}>*/}
                        {/*<Toolbar>*/}
                            {/*<IconButton color="inherit" onClick={this.handleClose} aria-label="Close">*/}
                                {/*<CloseIcon />*/}
                            {/*</IconButton>*/}
                            {/*<Typography variant="h6" color="inherit" className={classes.flex}>*/}
                                {/*友達を紹介*/}
                            {/*</Typography>*/}
                        {/*</Toolbar>*/}
                    {/*</AppBar>*/}

                    <main className={classes.content}>
                        <Grid container spacing={8} className={classes.center}>
                            <Grid item md={5} xs={12} sm={12} className={classes.friendList}>
                                <div className={classes.selectedFriend}>
                                    <Grid item md={12} xs={12} sm={12} className={classes.bigAvatarWrap}>
                                        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" className={classes.bigAvatar} />
                                    </Grid>
                                    <div className={classes.selectedFriendAName}>
                                        {this.state.friendA[0].name !== undefined ?
                                            <Grid item md={10} xs={10} sm={10}>{this.state.friendA[0].name}</Grid> :''
                                        }
                                        <Grid item md={2} xs={2} sm={2} style={{justifyContent:'flex-end'}}></Grid>
                                        <p>{}</p>
                                    </div>
                                </div>
                                <FriendList handleRadioChange={(val)=>{this.handleRadioChangeA(val)}} type={"radio"} friend={"A"}　mty={this.state.friendB}/>
                            </Grid>
                            <Grid item md={2} xs={12} sm={12} className={classes.iconConnect}>
                                ⇔
                            </Grid>
                            <Grid item md={5} xs={12} sm={12} className={classes.friendList}>
                                <div className={classes.selectedFriend}>
                                    <Grid item md={12} xs={12} sm={12} className={classes.bigAvatarWrap}>
                                        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" className={classes.bigAvatar} />
                                    </Grid>
                                    <div className={classes.selectedFriendAName}>
                                        {this.state.friendB[0].name !== undefined ?
                                            <Grid item md={10} xs={10} sm={10}>{this.state.friendB[0].name}</Grid> :''
                                        }
                                        <Grid item md={2} xs={2} sm={2} style={{justifyContent:'flex-end'}}>さん</Grid>
                                    </div>
                                </div>
                                <FriendList handleRadioChange={(val)=>{this.handleRadioChangeB(val)}} type={"radio"} friend={"B"} mty={this.state.friendA} />
                            </Grid>

                        </Grid>
                    </main>
                {/*</Dialog>*/}
            </div>
        )
    }
}
function CheckboxList() {
    const classes = styles;
    const [checked, setChecked] = React.useState([0]);

    const handleToggle = value => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];
        alert(checked)
        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };
    return (
        <List className={classes.root}>
            {[0, 1, 2, 3].map(value => (
                <ListItem key={value} role={undefined} dense button onChange={this.handleToggle}>
                    <ListItemAvatar>
                        <Avatar alt={`Avatar n°${value + 1}`} src={`/static/images/avatar/${value + 1}.jpg`} />
                    </ListItemAvatar>
                    <ListItemText primary={`Line item ${value + 1}`} />
                    <ListItemSecondaryAction>
                        <Checkbox
                            edge="end"
                            onChange={handleToggle(value)}
                            checked={checked.indexOf(value) !== -1}
                            disabled
                        />
                    </ListItemSecondaryAction>
                </ListItem>
            ))}
        </List>
    );
}

intro.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default compose(
    withStyles(styles),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(intro)