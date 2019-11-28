import React from "react";
import store from "~/src/store";

import ReactMde from "react-mde";
import Showdown from "showdown";
import "react-mde/lib/styles/css/react-mde-all.css";
import xssFilter from 'showdown-xss-filter'

import {withStyles} from "@material-ui/core";
import {compose} from "redux";
import {connect} from "react-redux";
const styles = theme => ({
});

class MarDown extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: store.getState().contents,
            tab: "write"
        };
        this.converter = new Showdown.Converter({
            tables: true,
            simplifiedAutoLink: true,
            strikethrough: true,
            tasklists: true,
            extensions: [xssFilter],
        });
    }
    //レンダリング直前
    componentWillMount() {
        //storeに値があればstateにつめる
        if (this.props.contents !== ''){
            this.setState({
                value:this.props.contents
            })
        }
    }
    //記事の変更時に発火
    handleValueChange = async (value) => {
        console.log("value:" + value)
        //親コンポーネントのcontentsに値をセット
        await this.props.setValue(value)
        //自コンポーネント
        await this.setState({
            value:value
        });
    };

    //MarkDownの「write」「preview」切り替え
    handleTabChange = (tab) => {
        this.setState({tab})
    };z

    render() {
        return (
            <div className="container">
                <ReactMde
                    onChange={this.handleValueChange}
                    onTabChange={this.handleTabChange}
                    value={this.props.contents}
                    generateMarkdownPreview={markdown =>
                    Promise.resolve(this.converter.makeHtml(markdown))}
                    selectedTab={this.state.tab}
                    readOnly={false}
                    minEditorHeight ={200}
                    name="contents"
                />

            </div>

        );
    }
}
export default compose(
    withStyles(styles),
    connect(
    )
)(MarDown)
