import React, { Component } from 'react';
import '../assets/scss/App.scss';
import {createMuiTheme, MuiThemeProvider, withStyles} from "@material-ui/core";
import {compose} from "redux";
import {connect} from "react-redux";
import Typography from '@material-ui/core/Typography';

import classNames from 'classnames';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import SettingsIcon from '@material-ui/icons/Settings';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { theme } from '../theme/theme';

import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { fade } from '@material-ui/core/styles/colorManipulator';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import SendIcon from '@material-ui/icons/Send';
import MenuList from '@material-ui/core/MenuList';
import DraftsIcon from '@material-ui/icons/Drafts';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import PropTypes from "prop-types";
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';
import PostEntry from '~/src/pages/PostEntry'
import ChatScreenDialog from '~/src/pages/ChatScreenDialog'
import PostTeam from '~/src/pages/PostTeam'
import {mapDispatchToProps, mapStateToProps} from "../action";
import {withRouter} from "react-router";
import AwsAuth from "../util/aws";
import Grid from "@material-ui/core/Grid";
import store from "../store";
import Api from "~/src/util/apis";
import LeftSideBar from "~/src/component/LeftSideBar"

const drawerWidth = 240;
const drawerWidth_sm = 60;

const styles = theme => ({
    root: {
        width: '100%',
    },
    grow: {
        flexGrow: 1,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        [theme.breakpoints.down('sm')]: {
            width: `calc(100% - ${drawerWidth_sm}px)`,
        },
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 30,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        [theme.breakpoints.down('sm')]: {
            width:drawerWidth_sm,
        },
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        [theme.breakpoints.down('sm')]: {
            width:drawerWidth_sm,
        },
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing.unit * 8 + 1,

        [theme.breakpoints.up('sm')]: {
             width: theme.spacing.unit * 7 + 1,
        },
        [theme.breakpoints.down('sm')]: {
            width: 0,
        },

    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
        marginLeft: -12,
        marginRight: 20,
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing.unit * 2,
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing.unit * 3,
            width: 'auto',
        },
    },
    searchIcon: {
        width: theme.spacing.unit * 9,
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
        width: '100%',
    },
    inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 10,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 200,
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    note:{
        // width:300
    },
    noteText:{
        fontSize:"14px",
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

class MainHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user_id:store.getState().user_id,
            open: false,
            anchorEl: null,
            mobileMoreAnchorEl: null,
            anchorNote: null,
            mobileAnchorNote: null,
            profileOpen: false,
            list_show_flg: false,
            items:[],
            note_count:0
        };
        const { classes, theme } = this.props;
        this.myRef = React.createRef();
        this.team = React.createRef()

        this.getNote()

    }

    handleDrawerOpen = () => {
        this.setState({ open: true });
    };

    handleDrawerClose = () => {
        this.setState({ open: false });
    };

    /** 個人メニュー**/
    handleProfileMenuOpen = event => {
        this.setState({ anchorEl: event.currentTarget });
    };
    handleMenuClose = () => {
        this.setState({ anchorEl: null });
        this.handleMobileMenuClose();
    };

    handleMobileMenuOpen = event => {
        this.setState({ mobileMoreAnchorEl: event.currentTarget });
    };

    handleMobileMenuClose = () => {
        this.setState({ mobileMoreAnchorEl: null });
    };
    /** 個人メニュー**/

    /** お知らせリスト**/
    handleNoteMenuOpen = event => {
        this.setState({ anchorNote: event.currentTarget });
    };

    handleNoteClose = () => {
        this.setState({ anchorNote: null });
        this.handleMobileNoteClose();
    };

    handleMobileNoteOpen = event => {
        this.setState({ mobileAnchorNote: event.currentTarget });
    };

    handleMobileNoteClose = () => {
        this.setState({ mobileAnchorNote: null });
    };
    /** お知らせリスト**/


    clickOpen = () => {
        this.setState({ profileOpen: true });
    };
    clickCloese = () => {
        this.setState({ profileOpen: false });
    };
    saveProfile = () =>{
      alert("save")
    };
    goError = async (e) => {
        await this.setState(
            {errors: (e.message || JSON.stringify(e))}
        )
    };
    goLogin = async () =>{
        try{
            await this.props.history.push({
                pathname: '/login/',
                state:{
                    // user_name: this.state.user_id,
                    // email: this.state.email
                }
            })
        } catch (e){
            this.goError(e)
        }
    }
    logout = async ()=>{
        await AwsAuth.signOut().then(await this.goLogin).then(this.props.clearState())
    };
    goMypage = async () => {
        try{
            this.props.history.push({
                pathname: '/mypage/',
                state:{
                    cd: this.state.user_id,
                }
            })
        } catch (e){
            this.goError(e)
        }
    };
    goProfileDisplay = async () =>{
        await this.props.history.push({
            pathname: '/profile/detail/',
            state:{
            }
        })
    }
    getNote = async () =>{
        let params = new URLSearchParams();

        params.set('user_id', this.state.user_id);
        let _this = this
        await Api.getNotice(params).then(
            function(response){
                console.log(response)
                _this.setState({
                    items:response.note,
                });
                if(_this.state.items.length > 0){
                    _this.setState({
                        list_show_flg:true,
                        note_count: _this.state.items.length
                    })
                }
                _this.setState({
                    display_loading:false,
                })
            }
        )
    }
    gotMyFriend = async()=>{
        await this.props.history.push({
            pathname: '/friend/',
            state:{
            }
        })
    }

    goMyEntry = async()=>{
        await this.props.history.push({
            pathname: '/entry/',
            state:{
            }
        })
    }
    goChat = async()=>{
        await this.props.history.push({
            pathname: '/chat/',
            state:{
            }
        })
    }
    goHome = async () =>{
        await this.props.history.push({
            pathname: '/',
            state:{
            }
        })

    }

    render() {
        const { classes } = this.props;
        const { anchorEl, mobileMoreAnchorEl, anchorNote, mobileAnchorNote } = this.state;
        const isMenuOpen = Boolean(anchorEl);
        const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

        const isNoteOpen = Boolean(anchorNote);
        const isMobileNoteOpen = Boolean(mobileAnchorNote);

        //個人設定アイコン押下で表示されるリスト
        const renderMenu = (
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={isMenuOpen}
                onClose={this.handleMenuClose}
            >
                <MenuItem>
                    <ListItemIcon>
                        <AccountCircle color="icon"/>
                        <Typography variant="inherit" noWrap >
                            <PostTeam menu={true}/>
                        </Typography>
                    </ListItemIcon>
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <AccountCircle color="icon"/>
                        <Typography variant="inherit" noWrap onClick={this.gotMyFriend}>
                            友達
                        </Typography>
                    </ListItemIcon>
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <AccountCircle color="icon"/>
                        <Typography variant="inherit" noWrap onClick={this.goMyEntry}>
                            投稿
                        </Typography>
                    </ListItemIcon>
                </MenuItem>
                <MenuItem onClick={this.handleProfileMenuOpen}>
                    <ListItemIcon>
                        <SettingsIcon color="third"/>
                        <Typography variant="inherit" noWrap>
                            設定
                        </Typography>
                    </ListItemIcon>
                </MenuItem>
                <MenuItem onClick={this.logout}>
                    <ListItemIcon>
                        <SettingsIcon color="third"/>
                        <Typography variant="inherit" noWrap>
                            ログアウト
                        </Typography>
                    </ListItemIcon>
                </MenuItem>

                {/*<MenuItem onClick={this.handleMenuClose}><AccountCircle color="secondary" />プロフィール</MenuItem>*/}
            </Menu>
        );
        const renderMobileMenu = (
            <Menu
                anchorEl={mobileMoreAnchorEl}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={isMobileMenuOpen}
                onClose={this.handleMenuClose}
            >
                {/*<MenuItem onClick={this.handleMobileMenuClose}>*/}
                {/*<IconButton color="inherit">*/}
                {/*<Badge badgeContent={4} color="secondary">*/}
                {/*<MailIcon />*/}
                {/*</Badge>*/}
                {/*</IconButton>*/}
                {/*<p>Messages</p>*/}
                {/*</MenuItem>*/}
                <MenuItem onClick={this.handleMobileMenuClose}>
                    <IconButton color="inherit">
                        <Badge badgeContent={11} color="secondary">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                    <p>記事を書く</p>
                </MenuItem>

                <PostTeam menu={true}/>

                <MenuItem onClick={this.handleMobileMenuClose}>
                    <IconButton color="inherit">
                        <Badge badgeContent={11} color="secondary">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                    <p>友達を紹介する</p>
                </MenuItem>
                <MenuItem onClick={this.handleMobileNoteOpen}>
                    <IconButton color="inherit">
                        <Badge badgeContent={this.note_count} color="secondary">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                    <p>Notifications</p>
                </MenuItem>
                <MenuItem onClick={this.handleProfileMenuOpen}>
                    <IconButton color="inherit">
                        <AccountCircle />
                    </IconButton>
                    <p>プロフィール</p>
                </MenuItem>
                <MenuItem onClick={this.handleProfileMenuOpen}>
                    <IconButton color="inherit">
                        <SettingsIcon />
                    </IconButton>
                    <p>設定</p>
                </MenuItem>
            </Menu>
        );

        //お知らせイコン押下で表示されるリスト
        const renderNote = (
            <Menu
                anchorEl={anchorNote}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={isNoteOpen}
                onClose={this.handleNoteClose}
            >
                {(this.state.list_show_flg)?
                    this.state.items.map(function (value, id) {
                        return(
                            <MenuItem className={classes.note}>
                                <ListItemIcon>
                                    {/*<AccountCircle color="icon"/>*/}
                                        <p className={classes.noteText}>
                                            {value.contents}
                                        </p>
                                </ListItemIcon>
                            </MenuItem>
                        );
                        }, this):
                            <MenuItem>
                                <ListItemIcon>
                                    <Grid container justify="center">
                                        <p>お知らせはありません</p>
                                    </Grid>
                                </ListItemIcon>
                            </MenuItem>

                    }
            </Menu>
        );
        const renderMobileNote = (
            <Menu
                anchorEl={mobileAnchorNote}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={isMobileNoteOpen}
                onClose={this.handleNoteClose}
            >
                {(this.state.list_show_flg)?
                    this.state.items.map(function (value, id) {
                        return (
                                <MenuItem>
                                    <ListItemIcon>
                                        <Grid container justify="center">
                                            <p>{this.state.list_show_flg}</p>
                                        </Grid>
                                    </ListItemIcon>
                                </MenuItem>
                            )
                        }, this):
                            <MenuItem>
                                <ListItemIcon>
                                    <Grid container justify="center">
                                        <p>お知らせはありません</p>
                                    </Grid>
                                </ListItemIcon>
                            </MenuItem>

                    }

            </Menu>
        );
        return (
            <MuiThemeProvider theme={typographyV1Theme(theme)}>
                <AppBar
                        color="primary"
                        position="fixed"
                        className={classNames(classes.appBar, {
                            [classes.appBarShift]: this.state.open,
                        })}
                    >
                        <Toolbar disableGutters={!this.state.open}>
                            <LeftSideBar />
                            <IconButton>
                                <Typography variant="h6" color="inherit" noWrap　onClick={this.goHome}>
                                    ロゴ
                                </Typography>
                            </IconButton>

                            <div className={classes.grow} />
                            <div className={classes.sectionDesktop}>
                                <IconButton
                                    aria-owns={isNoteOpen ? 'material-appbar' : undefined}
                                    aria-haspopup="true"
                                    onClick={this.handleNoteMenuOpen}
                                    color="inherit"
                                >
                                    {(this.state.list_show_flg)?
                                        <Badge badgeContent={this.state.note_count} color="secondary">
                                            <NotificationsIcon />
                                        </Badge>:
                                            <NotificationsIcon />
                                    }
                                </IconButton>
                                <IconButton
                                    aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                                    aria-haspopup="true"
                                    onClick={this.handleProfileMenuOpen}
                                     color="inherit"
                                >
                                    <AccountCircle />
                                </IconButton>
                            </div>
                            <div className={classes.sectionMobile}>
                                <IconButton aria-haspopup="true" onClick={this.handleMobileMenuOpen} color="inherit">
                                    <MoreIcon />
                                </IconButton>
                            </div>
                        </Toolbar>
                    </AppBar>

                {renderMenu}
                {renderMobileMenu}
                {renderNote}
                {renderMobileNote}
            </MuiThemeProvider>
        );
    }
}
MainHeader.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withRouter(compose(
    withStyles(styles,{ withTheme: true }),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(MainHeader))
