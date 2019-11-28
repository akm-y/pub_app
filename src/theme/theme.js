import {createMuiTheme} from '@material-ui/core/styles'

export const theme = createMuiTheme({
    type: 'light',
    typography: {
        useNextVariants: true,
    },
    palette: {
        primary: {
            light: '#40C4FF',
            main: '#448AFF',
            dark: '#505dff',
            contrastText: 'rgba(0, 0, 0, 0.54)',
            zIndex:0,
            fontSize: 12,
        },
        third: {
            light: '#ff7961',
            main: '#f44336',
            dark: '#ba000d',
            contrastText: '#fff',
            zIndex:0
        },
        secondary: {
            light: '#FFA054',
            main: '#E87B4D',
            dark: '#ff7961',
            contrastText: '#fff',
            zIndex:0
        },
    },
})