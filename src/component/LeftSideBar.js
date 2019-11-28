import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router'
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import {compose} from "redux";
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps} from "../action";
import IconButton from "./MainHeader";
import PostTeam from '~/src/pages/PostTeam'
import store from "../store";

const styles = {
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
};

class LeftSideBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            top: false,
            left: false,
            bottom: false,
            right: false,
            user_id:store.getState().user_id
        };
    }
    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    }

    toggleDrawer = (side, open) => () => {
        this.setState({
            [side]: open,
        });
    };
    render() {
        const { classes } = this.props;
        const goNext = async (path) =>{
            await this.props.history.push({
                pathname: path,
                state:{
                    user_id:this.state.user_id
                }
            })

        };

        const sideList = (
            <div className={classes.list}>
                <List>
                    <Divider />

                    <ListItem button key={1} onClick={()=>(goNext('/'))}>
                        <ListItemIcon><AccountBoxIcon/></ListItemIcon>
                        <ListItemText primary={"TOP"} />
                    </ListItem>
                    <ListItem button key={1} onClick={()=>(goNext('/profile/detail/'))}>
                        <ListItemIcon><AccountBoxIcon/></ListItemIcon>
                        <ListItemText primary={"プロフィール"} />
                    </ListItem>
                    <ListItem button key={1} onClick={()=>(goNext('/team/list/' + this.state.user_id))}>
                        <ListItemIcon><AccountBoxIcon/></ListItemIcon>
                        <ListItemText primary={"チーム"} />
                    </ListItem>
                    <ListItem button key={1} onClick={()=>(goNext('/friend/list/'))}>
                        <ListItemIcon><AccountBoxIcon/></ListItemIcon>
                        <ListItemText primary={"友達一覧"} />
                    </ListItem>
                    <ListItem button key={1} onClick={()=>(goNext('/friend/connect/'))}>
                        <ListItemIcon><AccountBoxIcon/></ListItemIcon>
                        <ListItemText primary={"つなげる"} />
                    </ListItem>

                    <ListItem button key={1} onClick={()=>(goNext('/entry/list/' + this.state.user_id))}>
                        <ListItemIcon><AccountBoxIcon/></ListItemIcon>
                        <ListItemText primary={"投稿一覧"} />
                    </ListItem>
                    <ListItem button key={1} onClick={()=>(goNext('/chat/aaaa'))}>
                        <ListItemIcon><AccountBoxIcon/></ListItemIcon>
                        <ListItemText primary={"チャット"} />
                    </ListItem>
                    <ListItem button key={1} onClick={()=>(goNext('/setting/'))}>
                        <ListItemIcon><AccountBoxIcon/></ListItemIcon>
                        <ListItemText primary={"設定"} />
                    </ListItem>
                    <ListItem button key={1} onClick={()=>(goNext('/rule/'))}>
                        <ListItemIcon><AccountBoxIcon/></ListItemIcon>
                        <ListItemText primary={"利用規約"} />
                    </ListItem>
                    <ListItem button key={1} onClick={()=>(goNext('/logout/'))}>
                        <ListItemIcon><AccountBoxIcon/></ListItemIcon>
                        <ListItemText primary={"ログアウト"} />
                    </ListItem>
                </List>
            </div>
        );

        return (
            <div>
                <Button onClick={this.toggleDrawer('left', true)}>Open Left</Button>
                <Drawer open={this.state.left} onClose={this.toggleDrawer('left', false)}>
                    <div
                        tabIndex={0}
                        role="button"
                        onClick={this.toggleDrawer('left', false)}
                        onKeyDown={this.toggleDrawer('left', false)}
                    >
                        {sideList}
                    </div>
                </Drawer>
            </div>
        );
    }
}

LeftSideBar.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default compose(
    withStyles(styles),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(withRouter(LeftSideBar))