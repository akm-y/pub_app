import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import {compose} from "redux";
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps} from "../action";
import PhoneIcon from '@material-ui/icons/Phone';
import Grid from '@material-ui/core/Grid';

function TabContainer(props) {
    return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
            {props.children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
};

const styles = theme => ({
    root: {
        flexGrow: 1,
        minHeight:200,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        textAlign:"left"
    },
});

class ScrollableTabsButtonAuto extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            user:this.props.info
        };
    }
    handleChange = (event, value) => {
        this.setState({ value });
    };
    componentWillMount() {
        console.log(this.state.user.profile.basic_info.memo)
    }

    render() {
        const { classes,info } = this.props;
        const { value } = this.state;
        console.log("info:"+info.profile.basic_info.memo)
        return (
            <div className={classes.root} >
                <AppBar position="static" color="default" id={"tab"}>
                    <Tabs
                        value={value}
                        onChange={this.handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="scrollable"
                        scrollButtons="auto"
                        className={"tab_item"}
                    >
                        <Tab label="自己紹介"  />
                        <Tab label="基本情報" />
                        <Tab label="スキル" />
                        {/*<Tab label="Item Four" />*/}
                        {/*<Tab label="Item Five" />*/}
                        {/*<Tab label="Item Six" />*/}
                        {/*<Tab label="Item Seven" />*/}
                    </Tabs>
                </AppBar>
                {value === 0 &&
                    <Grid container justify="center">
                        <Grid item lg={11}>
                            <TabContainer>
                                {info.profile.basic_info.memo}
                            </TabContainer>
                            </Grid>
                    </Grid>
                }
                {value === 1 &&
                    <TabContainer>
                        Item Two
                    </TabContainer>
                }
                {value === 2 &&
                    <TabContainer>
                        Item Three
                    </TabContainer>
                }
                {/*{value === 3 && <TabContainer>Item Four</TabContainer>}*/}
                {/*{value === 4 && <TabContainer>Item Five</TabContainer>}*/}
                {/*{value === 5 && <TabContainer>Item Six</TabContainer>}*/}
                {/*{value === 6 && <TabContainer>Item Seven</TabContainer>}*/}
            </div>
        );
    }
}


ScrollableTabsButtonAuto.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default compose(
    withStyles(styles),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(ScrollableTabsButtonAuto)
