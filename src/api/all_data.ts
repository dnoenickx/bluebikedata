import { useQuery } from "@tanstack/react-query";
import { Destinations, StationTripMap } from "../types/Data";

export const fetchAllData = (year: string): Promise<StationTripMap> => {
  const url = new URL(`/static/${year}_data.json`, window.location.origin);
  return fetch(url.toString()).then((resp) => resp.json());
};

export const fetchMonthlyDestinations = (
  year: string
): Promise<Destinations> => {
  const url = new URL(`/static/${year}_output.json`, window.location.origin);
  return fetch(url.toString()).then((resp) => resp.json());
};

export const useMonthlyDestinations = (
  stations: string[],
  year: "2022" | "2023"
): { [key: string]: number } | undefined => {
  const destinationsData = useQuery(["destinations", year], () =>
    fetchMonthlyDestinations(year)
  );
  if (!destinationsData.data) return undefined;
  const totals = {};
  stations.forEach((station) => {
    if (!destinationsData.data[station]) return undefined;

    destinationsData.data[station].forEach((value) => {
      const [station, count] = Object.entries(value).flat();
      if (!totals[station]) totals[station] = count;
      else totals[station] += count;
    });
  });
  return totals;
};
