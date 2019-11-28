const initialState = {
    user_id:"",
    token:"",
    timeline: [],
    text: "",
    human: {name: "", age: 0, nickname: ""},
    profile:{career:[],basic_info:[]},
    skill:{},
    friends:[],
    friend_detail:{},
    entry:{},
    user_photo:''
}


export default function reducer(state = initialState, action) {
    switch(action.type) {

        case 'GET_PROFILE':
            console.log(action);
            return {
              ...state,
                profile: action.profile
            };
        case 'SET_PROFILE':
            return{
                ...state,
                profile: action.profile
            };
        case 'SET_SKILL_LANG':
            return{
                ...state,
                skill: action.skill
            };
        case 'SET_SKILL_SERVER':
            return{
                ...state,
                skill: action.skill
            };
        case 'FRIENDS':
            return{
                ...state,
                friends: action.friends
            };
        case 'FRIEND_DETAIL':
            return{
                ...state,
                friend_detail: action.friend_detail
            };
        case 'SET_ENTRY':
            return {
                ...state,
                entry:action.entry
            };
        case 'SET_USER_ID':
            return {
                ...state,
                user_id:action.user_id
            };
        case 'SET_TOKEN':
            return {
                ...state,
                token:action.token
            };
        case 'SET_USER_PHOTO':
            return {
                ...state,
                user_photo:action.user_photo
            };
        case 'CLEAR_STATE':
            return initialState

        default:
            return state
        }
}
