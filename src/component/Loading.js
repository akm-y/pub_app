import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        // position: 'absolute',
        top: '50%',
        left: '50%',
        transForm: 'translate(-50%, -50%)'

},
    button: {
        margin: theme.spacing(2),
    },
    placeholder: {
        height: 40,
    },
}));

export default function DelayingAppearance(props) {
    const classes = useStyles();
    const [loading, setLoading] = React.useState(props.loading);
    const [query, setQuery] = React.useState('idle');
    const timerRef = React.useRef();

    React.useEffect(
        () => () => {
            clearTimeout(timerRef.current);
        },
        [],
    );

    // const handleClickLoading = () => {
    //     setLoading(prevLoading => !prevLoading);
    // };
    //
    // const handleClickQuery = () => {
    //     clearTimeout(timerRef.current);
    //
    //     if (query !== 'idle') {
    //         setQuery('idle');
    //         return;
    //     }
    //
    //     setQuery('progress');
    //     timerRef.current = setTimeout(() => {
    //         setQuery('success');
    //     }, 2000);
    // };

    return (
        <div className={classes.root}>
            <div className={classes.placeholder}>
                <Fade
                    in={props.loading}
                    // style={{
                    //     transitionDelay: loading ? '800ms' : '0ms',
                    // }}
                    unmountOnExit
                >
                    <CircularProgress color="secondary" />
                </Fade>
            </div>
            <div className={classes.placeholder}>
                {query === 'success' ? (
                    <Typography>Success!</Typography>
                ) : (
                    <Fade
                        in={query === 'progress'}
                        style={{
                            transitionDelay: query === 'progress' ? '800ms' : '0ms',
                        }}
                        unmountOnExit
                    >
                        <CircularProgress />
                    </Fade>
                )}
            </div>
        </div>
    );
}