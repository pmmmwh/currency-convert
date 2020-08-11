import httpErrors = require("http-errors");
import got from "got";
import type { CountryInfo, FixerData, RestCountriesData } from "@currency-convert/types";
import type { Request, Response } from "express";

async function countryDataHandler(req: Request, res: Response) {
  const { countryName } = req.params;
  try {
    // Get basic country info from RestCountries
    const {
      body: [{ currencies, name, population }]
    } = await got<RestCountriesData>(`https://restcountries.eu/rest/v2/name/${countryName}`, {
      responseType: "json",
      searchParams: {
        // Only choose fields we need
        fields: ["currencies", "name", "population"].join(";")
      }
    });

    // Get exchange rates from Fixer -
    // The capability to set a base currency is only available for paid subscriptions,
    // so we workaround that by getting rates with the default (EUR),
    // and transpose the exchange rates into what we want by algebra (x from/to SEK).
    const {
      body: { rates }
    } = await got<FixerData>("http://data.fixer.io/api/latest", {
      responseType: "json",
      searchParams: {
        access_key: process.env.ACCESS_KEY,
        symbols: [
          "SEK",
          // Get all currency codes (except SEK, since we fetch that by default)
          ...currencies.map(({ code }) => code.toUpperCase()).filter((code) => code !== "SEK")
        ].join(",")
      }
    });

    // Calculate SEK exchange rates w.r.t Euro exchange rates
    const fromSEK = (rateTo: number): number => rateTo / rates.SEK;
    const toSEK = (rateFrom: number): number => rates.SEK / rateFrom;

    const data: CountryInfo = {
      currencies: currencies.map((currency) => ({
        ...currency,
        rates: {
          from: toSEK(rates[currency.code.toUpperCase()]),
          to: fromSEK(rates[currency.code.toUpperCase()])
        }
      })),
      name,
      population
    };

    res.json(data);
    return;
  } catch (error) {
    // Custom handle 404 to provide more contextual errors when an invalid country is received
    if (error?.response.body?.status === 404) {
      res.status(404).json(httpErrors(404));
      return;
    }

    // Something is wrong and probably we cannot recover
    res.status(500).json(httpErrors(500));
  }
}

export = countryDataHandler;
