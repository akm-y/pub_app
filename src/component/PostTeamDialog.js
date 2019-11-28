import React from 'react';
import store from "~/src/store";
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import { mapStateToProps,mapDispatchToProps } from '../action.js';
import MarkDown from '../component/MarkDown'
import {compose} from "redux";
import {connect} from "react-redux";
import Api from "~/src/util/apis";
import Grid from '@material-ui/core/Grid';
import { green, purple } from '@material-ui/core/colors';
import TextField from '@material-ui/core/TextField';
import Transfer from '../component/Transfer'
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Common from '../util/common'
const styles = theme => ({
    root: {
        marginTop:40,
        marginBottom: 40
    },
    contents:{
        paddingLeft:20
    },
    appBar: {
        position: 'relative',
    },
    flex: {
        display:'flex',
        justifyContent:'space-between',
    },
    container: {
        display: 'flex',
        justifyContent:'space-between',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        marginTop:20
    },
    textField: {
        // marginLeft: theme.spacing.unit,
        // marginRight: theme.spacing.unit,
        // width:640,
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 140,
        display:'flex',
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
    tempButton: {
        margin: theme.spacing.unit,
        display:'flex',
        height: 40,
    },
    input: {
        display: 'none',
    },
    control: {
        padding: theme.spacing.unit * 2,
    },
    listRoot:{
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
        overflow: 'auto',
        maxHeight: 300,
        borderTop:'solid 2px #BCE0FD',
        borderRight:'solid 2px #BCE0FD',
        borderLeft:'solid 2px #BCE0FD',
        borderRadius:"4px",
        paddingBottom: '0px!important'
    },
    listItem:{
        borderBottom:'solid 2px #BCE0FD',
        padding:'0px!important',
        textAlign:'left'
    },
    draftListTitle:{
        textAlign:'left',
    },
    delete_icon: {
        textAlign:'center',
        color: "red",
        fontSize: 24,
        cursor: "pointer"
    },
    row:{
        marginBottom:30
    }
});

class PostTeam extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            post_team_open: false,
            user_id: store.getState().user_id,
            friends: [],
            team: {
                team_id: '',
                name: '',
                category: '',
                owner_user_id: '',
                image_path:'aaaa.jpg',
                contents:'',
                member: {}
            },
            display_loading: true
        }
        let _this = this
        let params = new URLSearchParams();
        params.set('user_id', this.state.user_id);

        Api.getFriends(params).then(
            function (response) {
                _this.setState({friends: response.friends})
                _this.setState({
                    display_loading:false,
                })
            }
        ).catch(
        )
    };
    //レンダリング直前
    componentWillMount= async ()=>{
    }
    componentDidMount = async ()=> {
        if(!Common.isEmpty(this.props.team_detail)){
            await this.setState({team:{
                team_id:this.props.team_detail.info.team_id,
                name:this.props.team_detail.info.name,
                category:this.props.team_detail.info.category,
                contents:this.props.team_detail.info.contents,
                owner_user_id:"",

            }
            })
        }
    }
    postTeamOpen = () => {
        this.setState({ post_team_open: true });
    };
    postTeamClose = async () => {
        await this.setState({ post_team_open: false });
    };

    //アラート画面を閉じる
    tempBtnClickClose = () => {
        this.setState({ draftSaveOpen: false });
    };
    setValue= async event => {
        let team = this.state.team;
        team[event.target.name] = event.target.value;
        this.setState( {team:team});
         this.props.setValue(event.target.name, event.target.value)
        console.log(this.state.team)
    };

    //stateにコンテンツをセット
    setContents = async (contents) => {
        let team = this.state.team;
        team["contents"] = contents;
        await this.setState({team: team});
        this.props.setContents(contents)
    };
    setMember = async (member) =>{
        await this.setState({
            member:member
        })
        this.props.setMember(this.state.member)

    };

    clear(){
        alert("clear")
        this.setState({
            team: {
                name: '',
                category: '',
                owner_user_id: '',
                image_path:'',
                contents:'',
                member: {}
            },
            entry_id:''
        });
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                <main className={classes.root} >
                    <Grid container justify={"center"}>
                        <Grid item xs={8} md={8} lg={8}>
                            <Grid container justify={"flex-start"} class="mb20">
                                <Grid item xs={6} md={6} lg={6}>
                                    <p className="head">チーム名を決める</p>
                                    <div className={classes.contents}>
                                        <TextField
                                            id="outlined-required"
                                            required
                                            fullWidth
                                            label="チームの名前"
                                            value={this.state.team.name}
                                            name="name"
                                            helperText="表示されます"
                                            margin="normal"
                                            variant="outlined"
                                            onChange={this.setValue}

                                        >
                                        </TextField>
                                    </div>
                                </Grid>
                                <Grid item xs={6} md={6} lg={6}>
                                    <p className="head">チームカテゴリを決める</p>
                                    <div className={classes.contents}>
                                        <TextField
                                            id="outlined-required"
                                            required
                                            fullWidth
                                            label="カテゴリ"
                                            value={this.state.team.category}
                                            name="category"
                                            helperText="表示されます"
                                            margin="normal"
                                            variant="outlined"
                                            onChange={this.setValue}

                                       />
                                    </div>
                                    {/*<TeamFriendsList/>*/}
                                </Grid>
                            </Grid>
                            {( () => {
                                //新規のときはprops.team_detailがないので表示する
                                if (Common.isEmpty(this.props.team_detail)) {
                                    if(!Common.isEmpty(this.state.friends)){
                                        return(
                                            <Grid container justify={"flex-start"} class="mb20">
                                                <p className="head">メンバーを招待する</p>
                                                <div className={classes.contents}>
                                                    <Grid item xs={12} md={12} lg={12}>
                                                        <Transfer friends={this.state.friends} setMember={this.setMember}/>
                                                        {/*<Grid container justify="center" className={classes.row}>*/}
                                                        {/*<TeamMember/>*/}
                                                        {/*</Grid>*/}
                                                    </Grid>
                                                </div>
                                            </Grid>
                                        )
                                    }
                                }
                            })()}
                            <Grid container justify={"center"} className={classes.row} class="mb20">
                                <Grid item lg={12} md={12} sm={12}>
                                    <p className="head">チーム紹介</p>
                                    <div className={classes.contents}>
                                        <Grid item xs={12} md={12} lg={12} className={classes.root}>
                                            <MarkDown contents={this.state.team.contents} setValue={this.setContents.bind(this)}/>
                                        </Grid>
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </main>
            </div>
        );
    }
}

PostTeam.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default compose(
    withStyles(styles),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(PostTeam)
