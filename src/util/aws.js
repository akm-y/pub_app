import AWS from 'aws-sdk'
const AmazonCognitoIdentity = require('amazon-cognito-identity-js')

AWS.config.region = process.env.AWS_COGNITO_ID_POOL_REGION;
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: process.env.AWS_COGNITO_ID_POOL_ID
});
console.log(process.env.NODE_ENV)
const AwsAuth = {
    getJwtToken: function () {
        return localStorage.token
    },

    setJwtToken: function (token) {
        localStorage.token = token
    },

    currentSession: function () {
        return new Promise(function (resolve, reject) {

            var userPoolData = {
                UserPoolId: process.env.AWS_COGNITO_USERPOOL_ID,
                ClientId: process.env.AWS_COGNITO_USERPOOL_CLIENT_ID
            }
            var userPool = new AmazonCognitoIdentity.CognitoUserPool(userPoolData)
            var cognitoUser = userPool.getCurrentUser()

            if (cognitoUser != null) {
                return cognitoUser.getSession(function (err, session) {
                    if (err) {
                        reject(err)
                        return
                    }
                    AwsAuth.setJwtToken(session.getIdToken().getJwtToken())
                    let params = {
                        IdentityPoolId: process.env.AWS_COGNITO_ID_POOL_ID,
                        Logins: {
                            [process.env.AWS_COGNITO_IDP]: session.getIdToken().getJwtToken()
                        }
                    }

                    AWS.config.credentials = new AWS.CognitoIdentityCredentials(params)
                    AWS.config.credentials.clearCachedId()
                    AWS.config.credentials.refresh((error) => {
                        if (error) {
                            reject(error)
                        } else {
                            resolve({session:session.getIdToken()})
                        }
                    });
                })
            } else {
                reject('No Session')
            }
        })
    },
    doLogin: function (userName, password) {
        return new Promise(function(resolve, reject){
            let authenticationData = {
                Username : userName,
                Password : password
            };
            let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData)

            let userPoolData = {
                UserPoolId : process.env.AWS_COGNITO_USERPOOL_ID,
                ClientId : process.env.AWS_COGNITO_USERPOOL_CLIENT_ID
            };
            let userPool = new AmazonCognitoIdentity.CognitoUserPool(userPoolData)
            const userData = {
                Username : userName,
                Pool : userPool
            };
            let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)

            cognitoUser.setAuthenticationFlowType('USER_PASSWORD_AUTH')

            cognitoUser.authenticateUser(authenticationDetails,{
                onSuccess: function (result) {

                    AwsAuth.setJwtToken(result.getIdToken().getJwtToken())
                    AWS.config.region = process.env.AWS_COGNITO_ID_POOL_REGION
                    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                        IdentityPoolId : process.env.AWS_COGNITO_ID_POOL_ID,
                        Logins : {
                            [process.env.AWS_COGNITO_IDP]: result.getIdToken().getJwtToken()
                        }
                    });
                    AWS.config.credentials.clearCachedId()
                    AWS.config.credentials.refresh((error) => {
                        console.log(error)
                        if (error) {
                            reject(error)
                        } else {
                            resolve(true)
                        }
                    });
                },
                onFailure: function (err) {
                    reject(err)
                },
                mfaRequired: function(result) {
                    reject("mfaRequired")
                },
                newPasswordRequired(result) {
                    reject("newPasswordRequired")
                },
                customChallenge(result) {
                    reject("customChallenge")
                }
            })
        })
    },
    /**
     *
     *
     */
    resendConfirmationCode: function (userName, password) {
        return new Promise(function(resolve, reject){
            let authenticationData = {
                Username : userName,
                Password : password
            };
            let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData)

            let userPoolData = {
                UserPoolId : process.env.AWS_COGNITO_USERPOOL_ID,
                ClientId : process.env.AWS_COGNITO_USERPOOL_CLIENT_ID
            };
            let userPool = new AmazonCognitoIdentity.CognitoUserPool(userPoolData)

            const userData = {
                Username : userName,
                Pool : userPool
            };
            let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)
            cognitoUser.setAuthenticationFlowType('USER_PASSWORD_AUTH')

            cognitoUser.resendConfirmationCode(function(err, result) {
                if (err) {
                    reject(err)
                }
                resolve(true)
            })
        })
    },

    /**
     *
     *
     */
    confirmRegistration: function (userName, password, registrationCode) {
        return new Promise(function(resolve, reject){
            var authenticationData = {
                Username : userName,
                Password : password
            }
            var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData)

            var userPoolData = {
                UserPoolId : process.env.AWS_COGNITO_USERPOOL_ID,
                ClientId : process.env.AWS_COGNITO_USERPOOL_CLIENT_ID
            }
            var userPool = new AmazonCognitoIdentity.CognitoUserPool(userPoolData)

            const userData = {
                Username : userName,
                Pool : userPool
            }
            var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)
            cognitoUser.setAuthenticationFlowType('USER_PASSWORD_AUTH')

            cognitoUser.confirmRegistration(registrationCode, true, function(err, result) {
                if (err) {
                    reject(err)
                }
                resolve(result)
            })
        })
    },

    /**
     *
     * サインイン
     */
    signUp: function (userName, password, email = null, phoneNumber = null) {
        return new Promise(function(resolve, reject){
            var userPoolData = {
                UserPoolId : process.env.AWS_COGNITO_USERPOOL_ID,
                ClientId : process.env.AWS_COGNITO_USERPOOL_CLIENT_ID
            }
            var userPool = new AmazonCognitoIdentity.CognitoUserPool(userPoolData)
            console.log(userPool)

            var attributeList = [];

            if (email !== null){
                var attribute = {Name : 'email', Value : email};
                attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute(attribute));
            }
            if (phoneNumber !== null){
                var attribute = {Name : 'phone_number', Value : phoneNumber};
                attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute(attribute));
            }
            console.log("attribute:"+attributeList[0])
            return userPool.signUp(userName, password, attributeList, null, function(err, result) {
                if (err) {
                    reject(err)
                }
                resolve(result.user)
            })
        })
    },

    /**
     *
     * サインアウト
     */
    signOut : function(){
        return new Promise(function(resolve, reject){
            var data = {
                UserPoolId : process.env.AWS_COGNITO_USERPOOL_ID,
                ClientId : process.env.AWS_COGNITO_USERPOOL_CLIENT_ID
            };
            var userPool = new AmazonCognitoIdentity.CognitoUserPool(data);
            var cognitoUser = userPool.getCurrentUser();
            if (cognitoUser != null) {
                cognitoUser.getSession(function (err, session) {
                    if (err) { alert(err); return; } else {console.log("session:" + session)}
                });
                cognitoUser.signOut()
                resolve(true)
            }
        })
    },

    /**
     *
     *　userpoolアカウント削除
     */
    deleteAccount : function(){
        return new Promise(function(resolve, reject){
            var data = {
                UserPoolId : process.env.AWS_COGNITO_USERPOOL_ID,
                ClientId : process.env.AWS_COGNITO_USERPOOL_CLIENT_ID
            };
            var userPool = new AmazonCognitoIdentity.CognitoUserPool(data);
            var cognitoUser = userPool.getCurrentUser();
            if (cognitoUser != null) {
                cognitoUser.getSession(function (err, session) {
                    if (err) { alert(err); return; } else {console.log("session:" + session)}
                });
                cognitoUser.deleteUser(function(err, result) {
                    if (err) {
                        alert(err);
                        return;
                    }
                    console.log('call result: ' + result);
                });
            }
        })
    },

    /**
     *　パスワード変更
     *
     */

    changePassword :function(oldPassword='', password=''){
        return new Promise(function(resolve, reject){
            var data = {
                UserPoolId : process.env.AWS_COGNITO_USERPOOL_ID,
                ClientId : process.env.AWS_COGNITO_USERPOOL_CLIENT_ID
            };
            var userPool = new AmazonCognitoIdentity.CognitoUserPool(data);
            var cognitoUser = userPool.getCurrentUser();
            if (cognitoUser != null) {
                cognitoUser.getSession(function (err, session) {
                    if (err) { alert(err); return; } else {console.log("session:" + session)}
                });
                cognitoUser.changePassword(oldPassword, password, function(err, result) {
                    console.log("err:"+err)
                    if (err) {
                        reject(err)
                    } else {
                        console.log('call result: ' + result);
                        resolve(result.user)
                    }
                });
            }
        })
    },
    validSession : function(){
        return new Promise(function(resolve, reject){
            var data = {
                UserPoolId : process.env.AWS_COGNITO_USERPOOL_ID,
                ClientId : process.env.AWS_COGNITO_USERPOOL_CLIENT_ID
            };
            var userPool = new AmazonCognitoIdentity.CognitoUserPool(data);
            var cognitoUser = userPool.getCurrentUser();
            if(cognitoUser != null){
                cognitoUser.getSession(function(err, sessresult){
                    //console.log("sessresult:"+sessresult.getIdToken().getJwtToken())
                    if(sessresult){
                        var cognitoParams = {
                            IdentityPoolId : process.env.AWS_COGNITO_ID_POOL_ID,
                            Logins : {
                                [process.env.AWS_COGNITO_IDP]: sessresult.getIdToken().getJwtToken()
                            }
                        };
                        AWS.config.credentials = new AWS.CognitoIdentityCredentials(cognitoParams);
                        AWS.config.credentials.get(function(err){
                            if(err){
                                alert(err);
                                reject(err);
                            }
                            resolve();
                        });
                    }else{
                        reject(err);
                    }
                });
            }else{
                reject('No cognito User');
            }
        });
    },
    /**
     *
     *　パスワード再発行（初回ログイン済み）
     */
    forgotPass : function(username){
        return new Promise(function(resolve, reject){
            let data = {
                UserPoolId : process.env.AWS_COGNITO_USERPOOL_ID,
                ClientId : process.env.AWS_COGNITO_USERPOOL_CLIENT_ID
            };
            var userPool = new AmazonCognitoIdentity.CognitoUserPool(data);
            let userData = {
                Username : username,
                Pool : userPool
            };
            var userPool = new AmazonCognitoIdentity.CognitoUserPool(data);
            let cognitoUser = userPool.getCurrentUser();
            if(cognitoUser != null){
                cognitoUser.forgotPassword({
                    onSuccess: function (result) {
                        smsMfaSettings = {
                            PreferredMfa : true,
                            Enabled : true
                        };
                        cognitoUser.setUserMfaPreference(smsMfaSettings, null, function(err, result) {
                            if (err) {
                                alert(err);
                            }
                            console.log('call result ' + result)
                        });
                    },
                    onFailure: function(err) {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(result.user)
                        }
                    },
                    inputVerificationCode() {
                        let verificationCode = prompt('検証コードを入力してください ' ,'');
                        let newPassword = prompt('新しいパスワードを入力してください ' ,'');
                        cognitoUser.confirmPassword(verificationCode, newPassword, function(err, result) {
                            if (err) {
                                reject(err)
                            }
                            resolve(true)
                        })
                    }
                });
            } else {
                reject(err)
            }
        });
    },

    /**
     *
     *　電話番号変更（ログイン済み）
     */
    changePhoneNumber : function(phone_number){
        return new Promise(function(resolve, reject){
            var attributeList = [];
            var attribute = {
                Name : "phone_number",
                Value : '+81' + phone_number
            };
            var attribute = new AmazonCognitoIdentity.CognitoUserAttribute(attribute);
            attributeList.push(attribute);

            var data = {
                UserPoolId : process.env.AWS_COGNITO_USERPOOL_ID,
                ClientId : process.env.AWS_COGNITO_USERPOOL_CLIENT_ID
            };
            var userPool = new AmazonCognitoIdentity.CognitoUserPool(data);
            var cognitoUser = userPool.getCurrentUser();

            cognitoUser.getSession(function (err, session) {
                if (err) {
                    alert(err); return;
                } else {
                    console.log("session:" + session)
                    cognitoUser.updateAttributes(attributeList, function(err, result) {
                        if (err) {
                            alert(err);
                            return;
                        } else {
                            resolve(result)
                        }
                    });
                }
            });
        });
    },
    /**
     *
     *　属性取得（ログイン済み）
     */
    getAttribute : function(){
        return new Promise(function(resolve, reject){
            var data = {
                UserPoolId : process.env.AWS_COGNITO_USERPOOL_ID,
                ClientId : process.env.AWS_COGNITO_USERPOOL_CLIENT_ID
            };
            var userPool = new AmazonCognitoIdentity.CognitoUserPool(data);
            var cognitoUser = userPool.getCurrentUser();
            cognitoUser.getSession(function (err, session) {
                if (err) { alert(err); return; } else {console.log("session:" + session)}
            });
            cognitoUser.getUserAttributes(function(err, result) {
                if (err) {
                    alert(err);
                    return;
                }
                for (var i = 0; i < result.length; i++) {
                    console.log('attribute ' + result[i].getName() + ' has value ' + result[i].getValue());
                }
                resolve(result)
            });
        });
    },
    /**
     *
     *　認証コード送信&チェック
     */
    sendVerificationCode: function () {
        return new Promise(function(resolve, reject){

            var userPoolData = {
                UserPoolId : process.env.AWS_COGNITO_USERPOOL_ID,
                ClientId : process.env.AWS_COGNITO_USERPOOL_CLIENT_ID
            }
            var userPool = new AmazonCognitoIdentity.CognitoUserPool(userPoolData)
            var cognitoUserOld = userPool.getCurrentUser();

            const userData = {
                Username : cognitoUserOld.username,
                Pool : userPool
            }
            console.log(cognitoUserOld.username)
            var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)
            cognitoUser.getSession(function (err, session) {
                if (err) {
                    alert(err); return;
                } else {
                    cognitoUser.getAttributeVerificationCode('email', {
                        onFailure: function(err2) {
                            console.log("ここ:"+err2.code);
                            reject(err2)
                        },
                        inputVerificationCode: function() {
                            /*検証コード*/
                            var verificationCode = prompt('認証コードを入力してください' ,'');
                            cognitoUser.verifyAttribute('email', verificationCode, {
                                onSuccess: function(result){
                                    resolve(result)
                                },
                                onFailure: function(err) {
                                    reject(err)
                                }
                            });
                        }
                    });
                }
            })
        })
    }
}
export default AwsAuth;
