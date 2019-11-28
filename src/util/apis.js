import AwsAuth from '../util/aws'

const Api = {

    getUser: async function(params){
        return fetch(
            process.env.API_HOST + '/users/?'+params.toString(),
            {
                method: 'GET',
                mode: 'cors',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                    //"Authorization": token
                },
                referrer: "", // no-referrer, *client
                //body: params.toString()
            }
        )
            .then(
                function (response) {
                    if (response.status == 200) {
                        return response.json()
                    }
                }
            )
            .then(function (data) {
                return data
            })
            .catch((error) => {
                console.log("getUserError"+error)
                return error
            });
    },

    existsUser: async function(params){
        return fetch(
            process.env.API_HOST + '/users/exists/?'+params.toString(),
            {
                method: 'GET',
                mode: 'cors',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                    //"Authorization": token
                },
                referrer: "", // no-referrer, *client
                //body: params.toString()
            }
        )
        .then(
            function (response) {
                if (response.status == 200) {
                    return response.json()
                }
            }
        )
        .then(function (data) {
            return data
        })
        .catch((error) => {
            console.log("getUserError"+error)
            return error
        });
    },
    postUser: async function(param){
        return fetch(
            process.env.API_HOST + '/users/register/',
            {
                method: 'POST',
                mode: 'cors',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                },
                // redirect: "follow", // manual, *follow, error
                referrer: "", // no-referrer, *client
                body: param
            }
        )
        .then(
            function (response) {
                if (response.status == 200) {
                    return response.json()
                }
            }
        )
        // .then(function (data) {
        //     return data
        // })
        .catch((error) => {
            console.log("ここ"+error)
          return error
        });
    },
    postProfile: async function(param){
        return fetch(
            process.env.API_HOST + '/users/profile/register/',
            {
                method: 'POST',
                mode: 'cors',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                },
                // redirect: "follow", // manual, *follow, error
                referrer: "", // no-referrer, *client
                body: param
            }
        )
        .then(
            function (response) {
                if (response.status == 200) {
                    return response.json()
                }
            }
        )
        .then(function (data) {
            return data
        })
        .catch((error) => {
            console.log("ここ"+error)
            return error
        });
    },

    postUserPhoto: async function(param){
        return fetch(
            process.env.API_HOST + '/users/photo/register/',
            {
                method: 'POST',
                mode: 'cors',
                headers: {
                    //"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                },
                // redirect: "follow", // manual, *follow, error
                referrer: "", // no-referrer, *client
                body: param
            }
        )
            .then(
                function (response) {
                    if (response.status == 200) {
                        return response.json()
                    }
                }
            )
            .then(function (data) {
                return data
            })
            .catch((error) => {
                console.log("ここ"+error)
                return error
            });
    },
    postSkill: async function(param){
        return fetch(
            process.env.API_HOST + '/users/skill/register/',
            {
                method: 'POST',
                mode: 'cors',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                },
                // redirect: "follow", // manual, *follow, error
                referrer: "", // no-referrer, *client
                body: param
            }
        )
            .then(
                function (response) {
                    if (response.status == 200) {
                        return response.json()
                    }
                }
            )
            .then(function (data) {
                return data
            })
            .catch((error) => {
                console.log("ここ"+error)
                return error
            });
    },
    getFriends: async function(params) {

        return fetch(
            process.env.API_HOST + '/friends/get/?' + params.toString(),
            {
                method: 'GET',
                mode: 'cors',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                    //"Authorization": token
                },
            }
        )
        .then(
            function (response) {
                if (response.status == 200) {
                    return response.json();
                }
            }
        )
        .then(jsonData => {
            return jsonData
        })
        .catch((error) => {
            return error
        });
    },
    getUserList: async function(params) {

        return fetch(
            process.env.API_HOST + '/friends/recommend/?' + params.toString(),
            {
                method: 'GET',
                mode: 'cors',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                    //"Authorization": token
                },
            }
        )
            .then(
                function (response) {
                    if (response.status == 200) {
                        return response.json();
                    }
                }
            )
            .then(jsonData => {
                return jsonData
            })
            .catch((error) => {
                return error
            });
    },

    getFriendDetail: async function(user_id) {
        //仮
        const friend = {
            profile:
                {
                    'main_image':'',
                    'avatar':'',
                    'first_name': '友達',
                    'last_name': '太郎',
                    'first_name_kana': 'トモダチ',
                    'last_name_kana': 'タロウ',
                    'prefecture': '東京都',
                    'job': 'フルスタック',
                    'subject':'サーバ構築からマウスの調達までなんでもやります。',
                    'detail':'経験や経歴など'
                }
            ,
            skill: [
                'php'
            ]
        }
        let param = {user_id: user_id};

        return fetch(
            'https://facebook.github.io/react-native/movies.json',
            {
                method: 'GET',
                mode: 'cors'
                //     body: JSON.stringify(param),
                //     credentials: 'include'
            }
        )
        .then(
            await function (response) {
                if (response.status == 200) {
                    return response.json()
                }
            }
        )
        .then(jsonData => {
            return jsonData
        })
        .catch((error) => {
            return error
        });
    },
    postRecruitContents: async function(user_id,contents){
        let param = {user_id: user_id};

        return fetch(
            'https://facebook.github.io/react-native/movies.json',
            {
                method: 'POST',
                mode: 'cors'
                //     body: JSON.stringify(param),
                //     credentials: 'include'
            }
        )
        .then(
            await function (response) {
                if (response.status == 200) {
                  return true
                }
            }
        )
        .catch((error) => {
            return error
        });
    },
    getEntriesAll: async function(params){
        return fetch(
            process.env.API_HOST + '/entries/',
            {
                method: 'GET',
                mode: 'cors',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                    //"Authorization": token
                },
            }
        )
        .then(await function (response) {
            if (response.status == 200) {
                return response.json()
            }
        })
        .then(jsonData => {
            return jsonData
        })

        .catch((error) => {
            return error
        });
    },
    getEntries: async function(params){
        return fetch(
            process.env.API_HOST + '/entries/user/?' + params.toString(),
            {
                method: 'GET',
                mode: 'cors',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                    // "Authorization": token
                },
            }
        )
            .then(await function (response) {
                if (response.status == 200) {
                    return response.json()
                }
            })
            .then(jsonData => {
                return jsonData
            })

            .catch((error) => {
                return error
            });
    },
    getTeamEntries: async function(params){
        return fetch(
            process.env.API_HOST + '/entries/team/?' + params.toString(),
            {
                method: 'GET',
                mode: 'cors',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                    // "Authorization": token
                },
            }
        )
            .then(await function (response) {
                if (response.status == 200) {
                    return response.json()
                }
            })
            .then(jsonData => {
                return jsonData
            })

            .catch((error) => {
                return error
            });
    },
    getEntryDetail: async function(params){
        return fetch(
            process.env.API_HOST + '/entries/get?' + params.toString(),
            {
                method: 'GET',
                mode: 'cors',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                    //"Authorization": token
                },
            }
        )
            .then(await function (response) {
                if (response.status == 200) {
                    return response.json()
                }
            })
            .then(jsonData => {
                return jsonData
            })

            .catch((error) => {
                return error
            });
    },
    getDraftEntryList: async function(params){
        return fetch(
            process.env.API_HOST + '/entries/draft/get?' + params.toString(),
            {
                method: 'GET',
                mode: 'cors',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                    //"Authorization": token
                },
            }
        )
            .then(await function (response) {
                if (response.status == 200) {
                    return response.json()
                }
            })
            .then(jsonData => {
                return jsonData
            })

            .catch((error) => {
                return error
            });
    },
    postEntries: async function(params){
        return fetch(
            process.env.API_HOST + '/entries/register',
            {
                method: 'POST',
                mode: 'cors',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                    //"Authorization": token
                },
                body:params
            }
        )
        .then(await function (response) {
            if (response.status == 200) {
                return response.json()
            }
        })
        .then(jsonData => {
            return jsonData
        })

        .catch((error) => {
            return error
        });
    },


    updateEntry: async function(params){
        return fetch(
            process.env.API_HOST + '/entries/update',
            {
                method: 'POST',
                mode: 'cors',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                    //"Authorization": token
                },
                body:params
            }
        )
            .then(await function (response) {
                if (response.status == 200) {
                    return response.json()
                }
            })
            .then(jsonData => {
                return jsonData
            })

            .catch((error) => {
                return error
            });
    },
    deleteEntries: async function(params){
        return fetch(
            process.env.API_HOST + '/entries/delete',
            {
                method: 'POST',
                mode: 'cors',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                    //"Authorization": token
                },
                body:params
            }
        )
            .then(await function (response) {
                if (response.status == 200) {
                    return response.json()
                }
            })
            .then(jsonData => {
                return jsonData
            })

            .catch((error) => {
                return error
            });
    },
    FriendFollow: async function(params){
        return fetch(
            process.env.API_HOST + '/friends/follow/',
            {
                method: 'POST',
                mode: 'cors',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                    //"Authorization": token
                },
                body:params
            }
        )
        .then(await function (response) {
            if (response.status == 200) {
                return response.json()
            }
        })
        .then(jsonData => {
            return jsonData
        })

        .catch((error) => {
            return error
        });
    },

    FriendApproval: async function(params){
        return fetch(
            process.env.API_HOST + '/friends/approval/',
            {
                method: 'POST',
                mode: 'cors',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                    //"Authorization": token
                },
                body:params
            }
        )
            .then(await function (response) {
                if (response.status == 200) {
                    return response.json()
                }
            })
            .then(jsonData => {
                return jsonData
            })

            .catch((error) => {
                return error
            });
    },

    getFriendStatus: async function(params){
        return fetch(
            process.env.API_HOST + '/friends/status/',
            {
                method: 'POST',
                mode: 'cors',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                    //"Authorization": token
                },
                body:params
            }
        )
        .then(await function (response) {
            if (response.status === 200) {
                return response.json()
            }
        })
        .then(jsonData => {
            return jsonData
        })

        .catch((error) => {
            return error
        });
    },
//チームAPI
    getBelongTeam: async function(params) {
        return fetch(
            process.env.API_HOST + '/team/belong?' + params.toString(),
            {
                method: 'GET',
                mode: 'cors',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                    //"Authorization": token
                }
            }
        )
            .then(await function (response) {
                if (response.status === 200) {
                    return response.json()
                }
            })
            .then(jsonData => {
                return jsonData
            })

            .catch((error) => {
                return error
            });
    },
    getRecommendTeam: async function(params) {
        return fetch(
            process.env.API_HOST + '/team/recommend?' + params.toString(),
            {
                method: 'POST',
                mode: 'cors',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                    //"Authorization": token
                },
                body:params
            }
        )
            .then(await function (response) {
                if (response.status === 200) {
                    return response.json()
                }
            })
            .then(jsonData => {
                return jsonData
            })

            .catch((error) => {
                return error
            });
    },

    getTeamDetail: async function(params) {
        return fetch(
            process.env.API_HOST + '/team/detail?'+ params.toString(),
            {
                method: 'GET',
                mode: 'cors',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                    //"Authorization": token
                }
            }
        )
        .then(await function (response) {
            if (response.status === 200) {
                console.log(response.json)
                return response.json()
            }
        })
        .then(jsonData => {
            return jsonData
        })

        .catch((error) => {
            return error
        });
    },
    getTeamMember: async function(params) {
        return fetch(
            process.env.API_HOST + '/team/members?'+ params.toString(),
            {
                method: 'GET',
                mode: 'cors',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                    //"Authorization": token
                }
            }
        )
        .then(await function (response) {
            if (response.status === 200) {
                console.log(response.json)
                return response.json()
            }
        })
        .then(jsonData => {
            return jsonData
        })

        .catch((error) => {
            return error
        });
    },
    postTeam: async function(params) {
        return fetch(
            process.env.API_HOST + '/team/create',
            {
                method: 'POST',
                mode: 'cors',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                    //"Authorization": token
                },
                body:params

            }
        )
            .then(await function (response) {
                if (response.status === 200) {
                    console.log(response.json)
                    return response.json()
                }
            })
            .then(jsonData => {
                return jsonData
            })

            .catch((error) => {
                return error
            });
    },

    updateTeam: async function(params) {
        return fetch(
            process.env.API_HOST + '/team/update',
            {
                method: 'POST',
                mode: 'cors',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                    //"Authorization": token
                },
                body:params

            }
        )
            .then(await function (response) {
                if (response.status === 200) {
                    console.log(response.json)
                    return response.json()
                }
            })
            .then(jsonData => {
                return jsonData
            })

            .catch((error) => {
                return error
            });
    },

    teamJoin: async function(params){
        return fetch(
            process.env.API_HOST + '/team/join',
            {
                method: 'POST',
                mode: 'cors',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                    //"Authorization": token
                },
                body:params

            }
        )
            .then(await function (response) {
                if (response.status === 200) {
                    console.log(response.json)
                    return response.json()
                }
            })
            .then(jsonData => {
                return jsonData
            })

            .catch((error) => {
                return error
            });
    },
//チームAPI

//お知らせAPI
    getNotice: async function(params){
        return fetch(
            process.env.API_HOST + '/notice/?'+ params.toString(),
            {
                method: 'GET',
                mode: 'cors',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                    //"Authorization": token
                }
            }
        )
            .then(await function (response) {
                if (response.status === 200) {
                    console.log(response.json)
                    return response.json()
                }
            })
            .then(jsonData => {
                return jsonData
            })

            .catch((error) => {
                return error
            });
    },
    postJoinNotice: async function(params){
        return fetch(
            process.env.API_HOST + '/notice/join',
            {
                method: 'POST',
                mode: 'cors',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                    //"Authorization": token
                },
                body:params

            }
        )
        .then(await function (response) {
            if (response.status === 200) {
                console.log(response.json)
                return response.json()
            }
        })
        .then(jsonData => {
            return jsonData
        })

        .catch((error) => {
            return error
        });
    },
    getChatRoom: async function(params){
        return fetch(
            process.env.API_HOST + '/chat/room?'+ params.toString(),
            {
                method: 'GET',
                mode: 'cors',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                    // "Authorization": token
                }
            }
        )
            .then(await function (response) {
                if (response.status === 200) {
                    console.log(response.json)
                    return response.json()
                }
            })
            .then(jsonData => {
                return jsonData
            })

            .catch((error) => {
                return error
            });
    },
    makeChatRoom: async function(params){
        return fetch(
            process.env.API_HOST + '/chat/make/',
            {
                method: 'POST',
                mode: 'cors',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                    // "Authorization": token
                },
                body:params
            }
        )
            .then(await function (response) {
                if (response.status === 200) {
                    return response.json()
                }
            })
            .then(jsonData => {
                return jsonData
            })

            .catch((error) => {
                return error
            });
    },
    getAllMyRoom: async function(params){
        return fetch(
            process.env.API_HOST + '/chat/room/all?'+ params.toString(),
            {
                method: 'GET',
                mode: 'cors',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                    // "Authorization": token
                }
            }
        )
        .then(await function (response) {
            if (response.status === 200) {
                return response.json()
            }
        })
        .then(jsonData => {
            return jsonData
        })

        .catch((error) => {
            return error
        });
    },
    postMessage: async function(params){
        return fetch(
            process.env.API_HOST + '/chat/message/post',
            {
                method: 'POST',
                mode: 'cors',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                    // "Authorization": token
                },
                body:params
            }
        )
            .then(await function (response) {
                if (response.status === 200) {
                    return response.json()
                }
            })
            .then(jsonData => {
                return jsonData
            })

            .catch((error) => {
                return error
            });
    },
};
export default Api
