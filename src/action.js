import store, { persistor } from './store'
import {Api} from '~/src/util/apis'

export function mapStateToProps(state) {
    return state;
}

export function mapDispatchToProps(dispatch) {
    return {
        setUserId:(val)=>{
            dispatch( {type: 'SET_USER_ID', user_id:val});
        },
        setCognitoToken:(val)=>{
            dispatch( {type: 'SET_TOKEN', token:val});
        },
        setProfile: (val) =>{
            dispatch( {type: 'SET_PROFILE', profile:val} );
        },
        setSkill:(lang,server,infra,detail)=>{
            dispatch( {type: 'SET_SKILL_LANG', skill:{lang:lang,server:server,infrastructure:infra,detail:detail}});
        },
        setEntry:(entry)=>{
            dispatch( {type: 'SET_ENTRY', entry});
        },
        getFriendsList: async (user_role = '')=>{
            const response = Api.getFriendsList(user_role)
            await response.then(
                await function (response) {
                    dispatch({type: 'FRIENDS', friends: response})
            })
        },
        setUserPhoto:(val)=>{
            dispatch( {type: 'SET_USER_PHOTO', user_photo:val});
        },

        clearState: async ()=>{
            dispatch( {type: 'CLEAR_STATE'});

        }
        // getFriendDetail: async (user_id)=>{
        //     const response = Api.getFriendDetail(user_id)
        //     await response.then(
        //         await function (response) {
        //             console.log(response)
        //             dispatch({type: 'FRIEND_DETAIL', friend_detail: response})
        //         })
        // }

    }
}
