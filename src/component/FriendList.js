import PropTypes from 'prop-types';
import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

import classNames from "classnames";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Radio from '@material-ui/core/Radio';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import {compose} from "redux";
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps} from "../action";
import green from '@material-ui/core/colors/green';
import Api from "~/src/util/apis";
import Common from "../util/common";
import store from "../store";
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
    },
    link:{
        textDecoration: 'none',
    },
    friendList:{
        height:'100vh',
        fontSize:'1.6rem'
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    cardContent:{
        padding:'0!important',
        height:300,
        overflowY:'scroll',
        border:'solid 1px highgray'
    },
    green: {
        color: green[400],
        '&$checked': {
            color: green[600],
        },
    },
    card:{
        borderRadius: '1em',
    },
    search:{
        padding: 8,
        borderBottom: 'solid 1px lightgray',
        // borderRadius: '0.5em',
        width:'100%',
        outline:0
    },
    checked: {},
});
const dudUrl = 'javascript:;';

class FriendList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items:[],
            list_show_flg:false
        }
    // propsによって実行する関数を変える
        // switch (this.props.friend) {
        //     case "A":
        //         this.friendSelected = this.handleChangeA;
        //         return;
        //     case "B":
        //         this.friendSelected = this.handleChangeA;
        //         return;
        //     default:
        //         return;
        // }

    };
    componentWillMount = async () => {

        this.friendSelected = this.handleChange;
        //友達リストにラジオボタンを持たせる
        this.state.isRadioBtn = (this.props.type === "radio");
        let _this = this
        _this.state.friends = store.getState().friends
        let params = new URLSearchParams();
        params.set('user_id', store.getState().user_id);
        await Api.getFriends(params).then(
            function(response){
                _this.setState({
                    initialItem:response.friends,
                    items:response.friends
                });
                if(_this.state.items.length > 0){
                    _this.setState({
                        list_show_flg:true
                    })

                }

            }
        );
    };
        componentDidMount = async () => {
         await this.setState({items: this.state.initialItem})
            this.state.items.map(function(value) {
            });
        };
    //基本は空
    friendSelected = () =>{};

    //クリックした友達のIDを受け取って何かする
    handleChange = async val =>{
        if(this.state.isRadioBtn) {//ラジオボタンをチェンジ
             if(val === this.props.mty[0].user_id){
                alert("同じ人は選択できません")
                return
            } else {
                 const targetList = this.state.items.filter((item) => {
                     //初期オブジェクトの中から選択した物を返す
                     return (item.user_id === val);
                 });
                 await this.setState({selectedValue: val});
                 await this.bind.handleRadioChange(targetList[0])
             }

        } else {

            console.log("sonot")
        }
    };
    filterList = async(e) => {
        const updateList = this.state.initialItem.filter((item) => {
            console.log(item.profile.first_name)
            return (item.profile.first_name.toLowerCase().search( e.target.value.toLowerCase()) !== -1 ||
                item.profile.last_name.toLowerCase().search( e.target.value.toLowerCase()) !== -1);
        });
        await this.setState({items: updateList})
    };
    render() {
        const { classes } = this.props;
        return (
            <div>
                {this.state.list_show_flg &&
                    <Grid container>
                        <Grid item xs={12} lg={12}>
                           <Card className={classes.card}>
                        <div>
                            <input type="text" placeholder="リストから検索" onChange={this.filterList}
                                   className={classes.search}/>
                        </div>
                        <CardContent className={classes.cardContent}>
                            <List className={classes.root}>

                                {this.state.items.map(function (value, id) {
                                    console.log(value.profile.basic_info.first_name)
                                    return (
                                        <ListItem key={value.user_id} role={undefined} dense button
                                                  onClick={() => this.friendSelected(value.user_id)}>
                                            <ListItemAvatar>
                                                <Avatar alt={`Avatar n°${value.user_id + 1}`}
                                                        src={`/static/images/avatar/${value.user_id + 1}.jpg`}/>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={`${value.profile.basic_info.first_name}` + `${value.profile.basic_info.last_name}`}/>
                                                <ListItemSecondaryAction>
                                                    {this.state.isRadioBtn &&
                                                    <Radio
                                                        className={"radio"}
                                                        checked={this.state.selectedValue == value.user_id}
                                                        onClick={() => this.friendSelected(value.user_id)}
                                                        color="default"
                                                        name="radio-button-demo"
                                                        aria-label="E"
                                                        icon={<RadioButtonUncheckedIcon fontSize="small"/>}
                                                        checkedIcon={<RadioButtonCheckedIcon fontSize="small"/>}
                                                        classes={{
                                                            root: classes.green,
                                                            checked: classes.checked,
                                                        }}
                                                    />
                                                    }
                                                </ListItemSecondaryAction>
                                        </ListItem>
                                    )
                                }, this)}
                            </List>
                        </CardContent>
                    </Card>
                        </Grid>
                    </Grid>
                }
            </div>
        );
    }
}



FriendList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default compose(
    withStyles(styles),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(FriendList)