export interface ApiCurrencyInfo {
  code: string;
  name: string;
  symbol: string;
}

export interface ApiCountryInfo {
  currencies: ApiCurrencyInfo[];
  name: string;
  population: number;
}

export type RestCountriesData = ApiCountryInfo[];

export interface FixerData {
  base: "EUR";
  date: string;
  rates: Record<string, number>;
  success: true;
  timestamp: number;
}

export interface CurrencyInfo extends ApiCurrencyInfo {
  rates: {
    from: number;
    to: number;
  };
}

export interface CountryInfo extends ApiCountryInfo {
  currencies: CurrencyInfo[];

  [key: string]: string | number | CurrencyInfo[];
}

export interface LoginInfo {
  token: string;
}
