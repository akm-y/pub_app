import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { AppBar, MenuItem, Drawer } from 'material-ui';
import {compose} from "redux";
import {withStyles} from "@material-ui/core";
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps} from "../action";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import Button from '@material-ui/core/Button';

import MoreHorizSharp from '@material-ui/icons/MoreHorizSharp';
const styles = theme => ({

    AppBar:{
        backgroundColor:"rgba(0, 0, 0, 0.54)!important",
        opacity:'0.6',
        position:'absolute!important'
    }
});
class FriendNavBar extends Component {

    constructor(props) {
        super(props);
    }
    OnTap(){
        return this.props.OnTap()
    }
    render() {
        const { classes } = this.props;

        return (
            <MuiThemeProvider>
                <div>
                    <Drawer
                        docked={false}
                        width={200}
                        open={this.props.open}
                        onRequestChange={this.props.OnTap}
                    >
                        <List>
                            {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                                <ListItem button key={text}>
                                    <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItem>
                            ))}
                        </List>
                    </Drawer>
                    <Button
                        title="React Study"
                        onClick={ () => this.props.OnTap()}
                    >
                        <MoreHorizSharp/>
                    </Button>

                    {/*<AppBar*/}
                        {/*className={classes.AppBar}*/}
                        {/*title="React Study"*/}
                        {/*onLeftIconButtonClick={ () => this.props.OnTap()}*/}
                    {/*/>*/}
                </div>
            </MuiThemeProvider>
        );
    }
}
export default compose(
    withStyles(styles),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(FriendNavBar)
