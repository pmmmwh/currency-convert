import * as React from 'react';
import { Grid, IconButton, InputAdornment, Table, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Add as AddIcon } from '@material-ui/icons';
import { useInfiniteQuery } from 'react-query';
import { useAuth } from '../components/AuthProvider';
import { ListTableBody, ListTableHead } from '../components/ListTable';
import Loading from '../components/Loading';
import NumberFormat from '../components/NumberFormat';
import Snackbar from '../components/Snackbar';
import { fetcher, roundTo, uniqBy } from '../utils';
import type { CountryInfo } from '@currency-convert/types';
import type { ChangeEvent, SyntheticEvent } from 'react';
import type { ListCell, ListTableDataRow } from '../components/ListTable';

const cells: ListCell[] = [
  { id: 'name', label: 'Name' },
  { id: 'population', label: 'Population', numeric: true },
  {
    id: 'currencies',
    label: 'Currencies',
  },
  {
    id: 'convertedAmounts',
    label: 'Converted Amounts',
    numeric: true,
  },
];

const errorMessages = {
  404: (country: string) =>
    [`Unable to find the received country: ${country}.`, 'Please check your input.'].join(' '),
  429: () => ['Rate limit reached for adding countries!', 'Please try again later!'].join(' '),
  default: (country: string) =>
    [`An error occurred while fetching data for: ${country}.`, 'Please try again!'].join(' '),
};

interface DataRow extends ListTableDataRow {
  convertedAmounts: string;
  currencies: string;
  name: string;
  population: string;

  [key: string]: string;
}

const useStyles = makeStyles((theme) => ({
  main: {
    height: '100%',
    padding: theme.spacing(4),
    width: '100%',
  },
  table: {
    minWidth: 536,
  },
}));

function MainContent() {
  // Text Fields
  const [SEKAmount, setSEKAmount] = React.useState(0);
  const [country, setCountry] = React.useState('');

  // Snack Bar
  const [
    { open: errorSnackbarOpen, message: errorSnackbarMessage },
    setErrorSnackbarState,
  ] = React.useState({
    open: false,
    message: '',
  });

  // Use JWT
  const { token } = useAuth();

  // Data Fetching
  const { data, fetchMore, isFetching } = useInfiniteQuery<CountryInfo, string, string>(
    'country',
    (url: string, name?: string) =>
      fetcher<CountryInfo>(`${url}/${name ?? ''}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    {
      // Disable fetch on mount
      enabled: false,
      getFetchMore() {
        // This is a placeholder -
        // in our case the next fetch is dynamically determined from `country`,
        // and the default value here will get overrode when we call `fetchMore`.
        return 'placeholder';
      },
      // Disable retries as it will make rate-limiting much more painful for users
      retry: 0,
    }
  );

  // Styling
  const classes = useStyles();

  function handleCountryChange({ target: { value } }: ChangeEvent<HTMLInputElement>) {
    setCountry(value);
  }

  function handleSEKAmountChange({ target: { value } }: ChangeEvent<HTMLInputElement>) {
    setSEKAmount(parseFloat(value));
  }

  async function handleSubmit(event: SyntheticEvent) {
    // Prevent browser default navigation on submit
    event.preventDefault();

    // Only fetch data when country is filled
    if (country) {
      try {
        await fetchMore(country);
        // Reset current input country if fetch is success
        setCountry('');
      } catch (error) {
        setErrorSnackbarState({
          open: true,
          // In accordance to the status code, show a relevant error message
          message: (
            errorMessages[(error?.status as keyof typeof errorMessages) ?? 'default'] ||
            errorMessages.default
          )(country),
        });
      }
    }
  }

  function handleSnackbarClose() {
    setErrorSnackbarState({ open: false, message: '' });
  }

  // Transform the data for render
  // We also memoize it here as looping arrays can be potentially expensive,
  // so we make sure only to re-run when relevant info changes.
  const transformedData: DataRow[] = React.useMemo(() => {
    // For consistency and to reduce duplication in display,
    // we take the unique of all available data by name before render.
    // This is because users can fetch different things but end up with the same result.
    return uniqBy(data ?? [], ({ name }) => name).map(({ currencies, population, ...restData }) => {
      // Filter out currencies with no symbol (which would indicate "no currency")
      const filteredCurrencies = currencies.filter(({ symbol }) => symbol);
      return {
        ...restData,
        // 1. Loop over all currencies' codes;
        // 2. Join them with '\n' if we're not processing the last item
        currencies: filteredCurrencies.reduce(
          (acc, { code }, ix) => `${acc}${code}${ix !== currencies.length - 1 ? '\n' : ''}`,
          ''
        ),
        population: population.toLocaleString('en-SE'),
        // 1. Loop over all currencies' rates;
        // 2. Convert SEKAmount to the currency with its symbol;
        // 3. Join them with '\n' if we're not processing the last item
        convertedAmounts: filteredCurrencies.reduce(
          (acc, { rates, symbol }, ix, arr) =>
            // We can safely round to 3 d.p. as no active currencies use more than that
            `${acc}${symbol}${roundTo(SEKAmount * rates.to, 3)}${
              ix !== arr.length - 1 ? '\n' : ''
            }`,
          ''
        ),
      };
    });
  }, [data, SEKAmount]);

  return (
    <>
      <Loading open={isFetching} />
      <Snackbar open={errorSnackbarOpen} onClose={handleSnackbarClose}>
        {errorSnackbarMessage}
      </Snackbar>
      <main className={classes.main}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            {/* A form is used here to allow `ENTER`-key submission heuristics */}
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Country"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="submit"
                        color="secondary"
                        onClick={handleSubmit}
                        onMouseDown={handleSubmit}
                      >
                        <AddIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onChange={handleCountryChange}
                placeholder="Add a country to the list"
                value={country}
                variant="outlined"
              />
            </form>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Amount (SEK)"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                inputComponent: NumberFormat,
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              onChange={handleSEKAmountChange}
              value={SEKAmount}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <Table className={classes.table} stickyHeader>
              <ListTableHead cells={cells} />
              <ListTableBody cells={cells} data={transformedData} />
            </Table>
          </Grid>
        </Grid>
      </main>
    </>
  );
}

export default MainContent;
