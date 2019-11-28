import React from 'react';
import store from "~/src/store";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import blue from '@material-ui/core/colors/blue';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from "../pages/PostTeam";
import {withRouter} from "react-router";
import {compose} from "redux";
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps} from "../action";
import Api from "~/src/util/apis";
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';
const emails = ['username@gmail.com', 'user02@gmail.com'];
const styles = theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
    tempButton: {
        margin: theme.spacing.unit,
        display:'flex',
        height: 40,
    },
});

class TeamFriendsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            friends: [],
            checked: [],
            user_id: store.getState().user_id,
        };
    }
    get_friends = async()=> {
        return new Promise(async (resolve, reject) => {
            let params = new URLSearchParams();
            params.set('user_id', this.state.user_id);

            await Api.getFriends(params).then(
                function (response) {
                    resolve(response)
                }
            ).catch(

            )
        })
    }
    handleToggle = value => () => {
        const { checked } = this.state;
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        this.setState({
            checked: newChecked,
        });

        // チェックを入れた時の動作
        //親コンポーネントの配列にidを入れる関数をここで呼ぶ

    };

    handleClose = () => {
        this.props.onClose(this.props.selectedValue);
    };

    handleListItemClick = value => {
        this.props.onClose(value);
    };

    render() {
        const { classes, onClose, selectedValue, ...other } = this.props;

        return (
            <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" {...other}>
                <DialogTitle id="simple-dialog-title">Set backup account</DialogTitle>
                <div>
                    <List className={classes.root}>
                        {this.state.friends.map(function (value, id) {
                            return(
                            <ListItem key={value} role={undefined} dense button onClick={this.handleToggle(value)}>
                                <Checkbox
                                    checked={this.state.checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                />
                                <ListItemText primary={JSON.parse(value.profile).basic_info.first_name +" "+ JSON.parse(value.profile).basic_info.last_name} />
                                <ListItemSecondaryAction>
                                    <IconButton aria-label="Comments">
                                        <CommentIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                            )
                        }, this)}
                    </List>
                </div>
            </Dialog>
        );
    }
}

TeamFriendsList.propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func,
    selectedValue: PropTypes.string,
};

const SimpleDialogWrapped = withStyles(styles)(TeamFriendsList);

class SimpleDialogDemo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            selectedValue: emails[1],
        };
    }

    handleClickOpen = () => {
        this.setState({
            open: true,
        });
    };

    handleClose = value => {
        this.setState({ selectedValue: value, open: false });
    };

    render() {
        const { classes } = this.props;

        return (
            <div>
                <Typography variant="subtitle1">Selected: {this.state.selectedValue}</Typography>
                <br />
                <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
                    メンバーを招待
                </Button>
                <SimpleDialogWrapped
                    selectedValue={this.state.selectedValue}
                    open={this.state.open}
                    onClose={this.handleClose}
                />
            </div>
        );
    }
}
export default compose(
    withStyles(styles),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(SimpleDialogDemo)



