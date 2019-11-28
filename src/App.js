import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';

import Header from './component/Header'
import { theme } from '~/src/theme/theme';
import Main from "~/src/pages/Main";
import Login from "~/src/pages/Login";
import {BrowserRouter, Switch, Route, withRouter} from 'react-router-dom';
import SignIn from '~/src/pages/SignIn';
import Activate from '~/src/pages/Activate';
import EntryDetail from '~/src/pages/EntryDetail';
import PostTeam from '~/src/pages/PostTeam';
import TeamDetail from '~/src/pages/TeamDetail';

import InputSkill from '~/src/pages/InputSkill';
import ProfileInput from '~/src/pages/ProfileInput';
import ProfileDetail from '~/src/pages/ProfileDetail';
import FriendDetail from '~/src/pages/FriendDetail';
import Friend from '~/src/pages/Friend';
import EntryMore from '~/src/pages/EntryMore';
import connect from "react-redux/es/connect/connect";
import {mapDispatchToProps, mapStateToProps} from "~/src/action";
import {Api} from "./util/apis";
import store from "./store";
import LoginCheckRoute from '~/src/component/LoginCheckRoute'
import NotFound from '~/src/pages/404'
import "@babel/polyfill";
import ChatForm from '~/src/component/ChatForm'
import AwsAuth from '~/src/util/aws'
import Common from '~/src/util/common'
import PostEntry from '~/src/pages/PostEntry'
import Chat from '~/src/pages/Chat'
import MainHeader from "~/src/component/MainHeader"
import Team from "~/src/pages/Team";
import FriendConnect from "~/src/pages/FriendConnect"

class App extends React.Component {
    constructor(props) {
        super(props);
    }
    goError = async (e) => {
        await this.setState(
            {errors: (e.message || JSON.stringify(e))}
        )
        await console.log("エラー:"+this.state.errors)
        await this.props.history.push({
            pathname: '/login'
        })

    }

    async componentDidMount(){
        // await AwsAuth.validSession()
        //     .then(
        //        await AwsAuth.currentSession().then().catch(this.goError)
        //     ).catch(
        //         this.goError
        //     )
        // const ok =  false
        // this.state = {
        //     isAuthenticated: ok,
        // };
        // if(this.state.isAuthenticated){
        //     this.props.getFriendsList(1)
        // }
    }
    render() {
        const url = 'https://facebook.github.io/react-native/movies.json'
        return (
            <MuiThemeProvider theme={theme} > {
            }
            <BrowserRouter >
                <div>
                    <MainHeader/>
                    <div className="mainContents">
                     <Switch>
                        <LoginCheckRoute exact path={'/'} component={Main} />
                        <LoginCheckRoute exact path={'/friend/detail/'} component={FriendDetail}/>
                        <Route exact path={'/signin'} component={SignIn}/>
                        <Route exact path="/activate" component={Activate}/>
                        <Route exact path={'/input/skill/'} component={InputSkill}/>
                        <Route exact path={'/profile/input/'} component={ProfileInput}/>
                        <Route exact path={'/profile/detail/'} component={ProfileDetail}/>
                        <Route exact path={'/friend/list'} component={Friend}/>
                        <Route exact path={'/friend/detail/:user_id'} component={FriendDetail}/>
                         <Route exact path={'/friend/connect/'} component={FriendConnect}/>

                         {/*<Route exact path={'/mypage/'} component={MyPage}/><!-- 使っていない-->*/}
                        <Route exact path={'/login/'} component={Login}/>
                        <Route exact path={'/entry/post'} component={PostEntry}/>
                        <Route exact path={'/entry/list/:user_id'} component={EntryMore}/>
                        <Route exact path={'/entry/:id'} component={EntryDetail}/>
                         <Route exact path={'/team/list/:id'} component={Team}/>

                         <Route exact path={'/team/post'} component={PostTeam}/>
                        <Route exact path={'/team/:id'} component={TeamDetail}/>
                        <Route exact path={'/team/more'} component={EntryMore}/>
                        <Route exact path={'/chat/:id'} component={Chat}/>

                        <Route component={NotFound} />
                    </Switch>
                    </div>
                </div>
            </BrowserRouter>
            </MuiThemeProvider>

        );
    }
}
export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(App)
)
