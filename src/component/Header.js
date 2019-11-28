import React, { Component } from 'react';
import logo from '../assets/logo.svg';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

// class Header extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {};
//     }
//
//     render() {
//         return (
//             <div>
//         <a href="/hello">ご挨拶</a>:
//             <a href="/about/1">1について/1</a>:
//         <a href="/about/2">2について/2</a>:
//         <a href="/">タイムライン</a>:
//         <a href="/human">人間検索</a>:
//         </div>
//     );
//     }
// }
class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login:false
        };
    }

    render() {
        return (
            <header className="header">
                <Toolbar>
                    <Typography variant="title" color="inherit">
                        Logo
                    </Typography>
                    <Grid container >
                        {!this.state.login && <Grid item xs={12} style={{textAlign:"right"}}>Login</Grid>}
                    </Grid>
                </Toolbar>
            </header>
        );
    }
}
export default Header;