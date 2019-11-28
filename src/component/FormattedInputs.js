import React from 'react';
import MaskedInput from 'react-text-mask';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import store from "~/src/store";

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
});

function TextMaskCustom(props) {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={ref => {
                inputRef(ref ? ref.inputElement : null);
            }}
            mask={[/\d/, /\d/, /\d/, 'ー', /\d/, /\d/, /\d/, /\d/]}
            placeholderChar={'\u2000'}
            showMask
        />
    );
}

TextMaskCustom.propTypes = {
    inputRef: PropTypes.func.isRequired,
};

function NumberFormatCustom(props) {
    const { inputRef, onChange, ...other } = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={values => {
                onChange({
                    target: {
                        value: values.value,
                    },
                });
            }}
            thousandSeparator
            prefix="$"
        />
    );
}

NumberFormatCustom.propTypes = {
    inputRef: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
};

class FormattedInputs extends React.Component {
    state = {
        textmask: '(1  )    -    ',
        numberformat: '1320',
    };

    handleChange =  name => async event => {
        this.setState({
            [name]: event.target.value,
        });
        const cloneProfile = Object.assign({},store.getState().profile);
        cloneProfile[event.target.name] = event.target.value;

        //stateにセット
        await this.setState(
            {"profile":cloneProfile}
        );
        //stateをstoreに保存
        await this.props.setProfile(cloneProfile)

    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.container}>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="formatted-text-mask-input">〒</InputLabel>
                    <Input
                        defaultvalue={this.props.zip}
                        onChange={this.handleChange('textmask')}
                        id="formatted-text-mask-input"
                        inputComponent={TextMaskCustom}
                        name="zip"
                    />
                </FormControl>
            </div>
        );
    }
}

FormattedInputs.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FormattedInputs);