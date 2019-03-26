import * as React from 'react';
import { createStyles, withStyles, WithStyles, Theme } from '@material-ui/core';
import { RemoteData, InStoreApi } from 'common/types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

interface State {
    rentals: RemoteData<InStoreApi[]>,
}

interface StateToProps {
    rentals: RemoteData<InStoreApi[]>,
    filter: boolean,
}

type Props = StateToProps & WithStyles<typeof styles>;

class Reports extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        console.log(props.rentals);        
    }
    componentDidMount() {        
        this.renderRentals();
    }


    renderRentals() {
        const classes = this.props.classes;
        const rentals = this.props.rentals;
        if (rentals.kind === 'LOADING') {
            return <div>Loading</div>;
        }
        if (rentals.kind === 'ERROR') {
            return <div>{rentals.error}</div>;
        }

        const rentalData = rentals.data;

        const rentalDataRows = rentalData.map((rental) => {
            const responsiblePerson = rental.responsiblePerson;
            const name = responsiblePerson.firstName + ' ' + responsiblePerson.lastName;
            const startDate = rental.startDate;
            const endDate = rental.endDate;
            const price = rental.charge.amount;
            const priceString = (price / 100).toFixed(2);
            return (
                <TableRow key={rental.id}>
                    <TableCell >{name}</TableCell>                    
                    <TableCell align="right">{startDate}</TableCell>
                    <TableCell align="right">{endDate}</TableCell>
                    <TableCell align="right">{priceString}</TableCell>
                </TableRow>
            );
        });

        return (            
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Start Date</TableCell>
                            <TableCell align="right">End Date</TableCell>
                            <TableCell align="right">Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rentalDataRows}
                    </TableBody>
                </Table>
            </Paper>

        );
    }

    render() {
        return (
            <div>
                {this.props.filter ?
                    this.renderRentals() :
                    ''
                }
            </div>
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
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
});

export default withStyles(styles)(Reports);
