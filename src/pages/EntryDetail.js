import React, { Component } from 'react';
import '../assets/scss/App.scss';
import {createMuiTheme, List, MuiThemeProvider, withStyles} from "@material-ui/core";
import classnames from 'classnames';

import {compose} from "redux";
import {connect} from "react-redux";
import PropTypes from "prop-types";

import red from '@material-ui/core/colors/red';
import Api from "~/src/util/apis";
import store from "../store";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {theme} from "../theme/theme";
import Header from "../component/Header";
import AppBar from "./SignIn";
import {mapDispatchToProps, mapStateToProps} from "../action";
import ReactMde from "react-mde";
import Showdown from "showdown";
import "react-mde/lib/styles/css/react-mde-all.css";
import xssFilter from 'showdown-xss-filter'
import aa from '../../src/assets/css/MarkDownPreview.css'
const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        backgroundColor: theme.palette.background.paper,
        borderRadius: '1em',
    },
    grow: {
        flexGrow: 1,
    },

    content: {
        flexGrow: 1,
        // padding: theme.spacing.unit * 3,
        marginTop: 65,
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    gridItem:{
        width:'100%'
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    },
    card: {
        border:1,
        maxWidth: 300,
        minWidth: 300,
        maxHeight:300


    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    actions: {
        display: 'flex',
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
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

// https://github.com/andrerpena/react-mde/blob/master/src/components/MdePreview.tsx

class EntryDetail extends Component {
    constructor(props) {
        const {params} = props.match
        super(props);
        this.state = {
            entry_id:'',
            entryDetail:[],
            list_show_flg:false,
            choice:[],
            tab: "write"

        };
        this.converter = new Showdown.Converter({
            tables: true,
            simplifiedAutoLink: true,
            strikethrough: true,
            tasklists: true,
            extensions: [xssFilter],
        });
    }

    getImage = (url) => { return require(`${url}`) };
    handleExpandClick = () => {
        this.setState(state => ({ expanded: !this.state.expanded }));
    };
    componentWillMount = async()=> {
        let params = new URLSearchParams();
        let _this = this;

        await this.setState({
            entry_id:this.props.location.state.entry.entry_id
        });
        if(this.state.entry_id !==''){
            this.setState({
                list_show_flg:true
            })
        }
        params.set('entry_id', this.state.entry_id);
        //記事詳細取得 getEntryDetail
        await Api.getEntries(params).then(
            await function(response){
                 _this.setState({
                    entryDetail:response.entries[0],
                });
                if(_this.state.entryDetail){
                    _this.setState({
                        list_show_flg:true
                    })
                }
            }
        )
        await console.log(this.state.entryDetail)
    };
    setContents = async (contents) =>{
        await this.setState( {
            contents:contents
        });
        await console.log(this.state)
    };
    //MarkDownの「write」「preview」切り替え
    handleTabChange = (tab) => {
        this.setState({tab})
    };

    render() {
        const { classes} = this.props;
        const _this = this;
        return (
            <MuiThemeProvider theme={typographyV1Theme(theme)}>
                <Header/>
                <div className={classes.root} id="entry">
                    <h1>{_this.state.entryDetail.title}</h1>
                    <Grid container>
                        <Grid item xs={1}　lg={3}>
                        </Grid>
                        <Grid item xs={10}　lg={6} justify="flex-start">
                            {this.state.list_show_flg &&
                                <ReactMde
                                    value={_this.state.entryDetail.content}
                                    generateMarkdownPreview={markdown =>
                                        Promise.resolve(this.converter.makeHtml(markdown))}
                                    selectedTab="preview"
                                    readOnly={true}
                                    minEditorHeight ={300}

                                />
                            }
                        </Grid>
                        <Grid item xs={1}　lg={3}>
                        </Grid>
                    </Grid>
                </div>
            </MuiThemeProvider>
        );
    }
}
EntryDetail.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default compose(
    withStyles(styles),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(EntryDetail)