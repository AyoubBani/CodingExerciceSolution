import * as React from 'react';
import { connect } from 'react-redux';
import { createStyles, withStyles, WithStyles, Theme } from '@material-ui/core';
import Container from 'components/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import classNames from 'classnames';
import { Button } from '@material-ui/core';
import { ReduxState } from 'services/types';
import { RemoteData, InStoreApi, ShopApi } from 'common/types';
import { updateRentals } from 'actions';

import Reports from './Reports';

import { db } from 'services/firebase';
const moment = require('moment');

interface DispatchProps {
    updateRentals: (shops: RemoteData<InStoreApi[]>) => void,
}

interface State {
    startDate: string,
    endDate: string,
    rentals: RemoteData<InStoreApi[]>,
    filterRentals: RemoteData<InStoreApi[]>,
    filter: boolean,
    searchText: string,
}

interface StateToProps {
    className?: any,
    style?: any,
    children?: any,
    id?: string,
    paddingBottom?: boolean,
    startDate: string,
    endDate: string,
    filter: boolean,
    shop: ShopApi,
}

type Props = DispatchProps & StateToProps & WithStyles<typeof styles>;
type InputEvent = React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
class FilterView extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        const list: InStoreApi[] = [];
        const filredRentals_: RemoteData<InStoreApi[]> = { kind: 'FETCHED', data: list };
        this.state = {
            rentals: { kind: 'LOADING' },
            filterRentals: filredRentals_,
            filter: false,
            startDate: '',
            endDate: '',
            searchText: '',
        };
    }

    handleSearchText = (event: InputEvent) => {
        const value = event.target.value;
        this.setState({
            searchText: value,
        });
    }

    handleStartDate = (event: InputEvent) => {
        const value = event.target.value;
        this.setState({
            startDate: value,
        });
    }

    handleEndDate = (event: InputEvent) => {
        const value = event.target.value;
        this.setState({
            endDate: value,
        });
    }

    toTimeStamp = (dateString: string) => {
        return new Date(dateString.split('-').reverse().join('/')).getTime();
    }

    componentDidMount() {
        this.getRentals();
    }

    getRentals() {
        const shopId = this.props.shop.id;
        const rentalsRef = db.collection('rentals')
            .where('shopId', '==', shopId)
            .where('rentalState', '==', 'COMPLETED')
            .orderBy('endDate', 'asc');
        rentalsRef.get().then((querySnapshot) => {
            const rentalList: InStoreApi[] = [];
            console.log(querySnapshot.docs.length);
            for (const rentalDoc of querySnapshot.docs) {
                const rental = rentalDoc.data() as InStoreApi;
                rentalList.push(rental);
            }

            const rentals: RemoteData<InStoreApi[]> = { kind: 'FETCHED', data: rentalList };
            this.setState({
                rentals,
                filterRentals: rentals
            });
            console.log(rentals);
            this.props.updateRentals(rentals);
            this.setState({ filter: true });
        }, (error) => {
            const rentals: RemoteData<InStoreApi[]> = { kind: 'ERROR', error: error.message };
            this.setState({
                rentals
            });
        });
    }


    pickDateRange = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!this.state.startDate && !this.state.endDate) {
            console.log('No Date is available...');
        } else {

            if (this.state.rentals.kind === 'FETCHED') {
                const startDate = moment.utc(this.state.startDate);
                const endDate = moment.utc(this.state.endDate);
                const rentalFiltredList: InStoreApi[] = [];
                console.log('fetching from: ' + startDate + ' to ' + endDate);
                for (const rental of this.state.rentals.data) {
                    const rentalStartDate = new Date(rental.startDate);
                    const rentalEndDate = new Date(rental.endDate);
                    const name = rental.responsiblePerson.firstName + ' ' + rental.responsiblePerson.lastName;
                    const searchTextExists = this.state.searchText !== '';
                    console.log('bool: ' + searchTextExists);
                    if (this.state.startDate && this.state.endDate) {
                        console.log('Both dates are available!');
                        if ((rentalStartDate >= startDate._d) && (rentalEndDate <= endDate._d)) {
                            if (searchTextExists) {
                                if (name.includes(this.state.searchText)) { rentalFiltredList.push(rental); }
                            } else {
                                rentalFiltredList.push(rental);
                            }
                        }
                    } else {
                        if (this.state.startDate) {
                            console.log('Only startDate is available!');
                            if (rentalStartDate >= startDate._d) {                                
                                if (searchTextExists) {
                                    if (name.includes(this.state.searchText)) {
                                        rentalFiltredList.push(rental);
                                    }
                                } else {
                                    rentalFiltredList.push(rental);
                                }
                            }
                        }
                        if (this.state.endDate) {
                            console.log('Only endDate is available!');
                            if (rentalEndDate <= endDate._d) {                                
                                if (searchTextExists) {
                                    if (name.includes(this.state.searchText)) {
                                        rentalFiltredList.push(rental);
                                    }
                                } else {
                                    rentalFiltredList.push(rental);
                                }
                            }
                        }
                    }

                }

                const filterRentals: RemoteData<InStoreApi[]> = { kind: 'FETCHED', data: rentalFiltredList };
                this.setState({
                    filterRentals
                });
            }
        }

    }
    render() {
        const classes = this.props.classes;
        return (
            <Container>
                <Typography variant="h5" gutterBottom className={classes.header}>
                    Dummy report
                    </Typography>

                <form onSubmit={this.pickDateRange} className={classes.container} noValidate>
                    <TextField
                        id="standard-search"
                        label="Search field"
                        type="search"
                        onChange={this.handleSearchText}
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        id="datestart"
                        label="Starting Date"
                        type="date"
                        onChange={this.handleStartDate}
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        id="dateend"
                        label="Ending Date"
                        type="date"
                        onChange={this.handleEndDate}
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        disableRipple
                        className={classNames(classes.margin, classes.bootstrapRoot)}
                        type="submit"
                    >
                        Filter
                    </Button>
                </form>
                <hr />
                <Reports filter={this.state.filter} rentals={this.state.filterRentals} />

            </Container>
        );
    }
}

const styles = (theme: Theme) => createStyles({
    header: {
        marginBottom: 32,
    },
    leftAlign: {
        textAlign: 'left',
    },
    margin: {
        margin: theme.spacing.unit,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    bootstrapRoot: {
        boxShadow: 'none',
        textTransform: 'none',
        fontSize: 16,
        padding: '6px 12px',
        border: '1px solid',
        lineHeight: 1.5,
        backgroundColor: '#007bff',
        borderColor: '#007bff',
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:hover': {
            backgroundColor: '#0069d9',
            borderColor: '#0062cc',
        },
        '&:active': {
            boxShadow: 'none',
            backgroundColor: '#0062cc',
            borderColor: '#005cbf',
        },
        '&:focus': {
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
        },
    },
});

const mapStateToProps = ({ startDate, endDate, filter, shops }: ReduxState): StateToProps => {
    const { activeShop } = shops;
    return { startDate, endDate, filter, shop: activeShop!, };
};
export default withStyles(styles)(connect(mapStateToProps, { updateRentals })(FilterView));