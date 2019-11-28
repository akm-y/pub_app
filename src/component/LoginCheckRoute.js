import React, { Component } from 'react'
import { Route, Redirect } from "react-router-dom"
// import AuthService from './services/AuthService'  // ログインチェックを行うサービス.
import AwsAuth from '~/src/util/aws'

class LoginCheckRoute extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading : true,
            isAuthenticated : false
        }
    }
    sessionOk = async () => {
        this.setState({
            loading:false,
            isAuthenticated:true
        })
    };
    goError = async (e) =>{
        this.setState({
            loading:false
        })
    };
    async componentDidMount() {

        await AwsAuth.validSession()
            .then(
                this.sessionOk
            ).catch(
                this.goError
            )
    }

    render() {

        // ルーティング情報を取得.
        const { component : Component, ...rest } = this.props

        // ログインチェック状態を取得.
        const { loading, isAuthenticated } = this.state

        // ログインチェック前なら、ローディングを表示.
        if (loading) {
            return <div className="loading">Loading...</div>
        }
        // ログインチェック後はルーティング処理を行う.
        return (
            <Route {...rest} render={() => {
                // 未ログインなら、ログイン画面にリダイレクト.
                if (!isAuthenticated) {
                    return <Redirect to={{ pathname: '/login/', state: { from: this.props.location } }} />
                }
                // ログイン済なら、指定されたコンポーネントを表示.
                return <Component {...this.props} />
            }}
            />
        )
    }
}

export default LoginCheckRoute