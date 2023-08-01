import { useSearchParams } from "react-router-dom";
import { create } from "zustand";
import { DateOptions, MetricsType, TripDistancesType } from "../types/Data";

export type paramsType = keyof typeof Params;

export enum Params {
  metric = "metric",
  ridershipMin = "ridershipMin",
  distance = "distance",
}
export type paramsMap = {
  [key in paramsType]?: string;
};
interface ConfigStore {
  distance: TripDistancesType;
  ridershipMin: number;
  metric: MetricsType;
  date: DateOptions;
  station: string | undefined;
  startStations: string[] | undefined;

  setDistance: (distance: TripDistancesType) => void;
  setRidership: (ridershipMin: string | number) => void;
  setMetric: (metric: MetricsType) => void;
  setDate: (date: DateOptions) => void;
  setStation: (station: string | undefined) => void;
  setStartStations: (startStations: string[] | undefined) => void;
  loadFromParams: (params: { [key: string]: string }) => void;
}

export const useConfigStore = create<ConfigStore>((set, get) => ({
  distance: "nonzero",
  ridershipMin: 100,
  metric: "total",
  date: "comp",
  station: undefined,
  startStations: undefined,
  setDistance: (distance) => set(() => ({ distance: distance })),
  setRidership: (ridershipMin) => {
    const _ridershipMin =
      typeof ridershipMin === "number" ? ridershipMin : parseInt(ridershipMin);
    return set(() => ({
      ridershipMin: _ridershipMin,
    }));
  },
  setMetric: (metric) => set(() => ({ metric: metric })),
  setDate: (date) => set(() => ({ date: date })),
  setStation: (station) => set(() => ({ station: station })),
  setStartStations: (startStations) =>
    set(() => ({ startStations: startStations })),
  loadFromParams: (searchParams) => {
    const configStoreObject = {};
    if (
      searchParams["distance"] &&
      ["all", "nonzero", "oneplus"].includes(searchParams["distance"])
    )
      configStoreObject["distance"] = searchParams["distance"];

    if (
      searchParams["metric"] &&
      ["total", "median_trip_duration", "median_distance_miles"].includes(
        searchParams["metric"]
      )
    )
      configStoreObject["metric"] = searchParams["metric"];

    if (searchParams["station"])
      configStoreObject["station"] = searchParams["station"];

    if (
      searchParams["ridershipMin"] &&
      !isNaN(parseInt(searchParams["ridershipMin"]))
    )
      configStoreObject["ridershipMin"] = parseInt(
        searchParams["ridershipMin"]
      );

    return set(() => configStoreObject);
  },
}));

export const useUpdateRidershipMin = () => {
  const setRidership = useConfigStore((store) => store.setRidership);
  const [searchParams, setSearchParams] = useSearchParams();
  return (ridershipMin: string | number) => {
    const _ridershipMin =
      typeof ridershipMin === "number" ? ridershipMin : parseInt(ridershipMin);
    setRidership(_ridershipMin);
    searchParams.set("ridershipMin", _ridershipMin.toString());
    setSearchParams(searchParams);
  };
};

export const useUpdateMetric = () => {
  const setMetric = useConfigStore((store) => store.setMetric);
  const [searchParams, setSearchParams] = useSearchParams();
  return (metric: MetricsType) => {
    setMetric(metric);
    searchParams.set("metric", metric);
    setSearchParams(searchParams);
  };
};

export const useUpdateStation = () => {
  const setStation = useConfigStore((store) => store.setStation);
  const [searchParams, setSearchParams] = useSearchParams();
  return (station: string | undefined) => {
    if (station === undefined) {
      searchParams.delete("station");
      setSearchParams(searchParams);
    } else {
      searchParams.set("station", station);
      setSearchParams(searchParams);
    }
    setStation(station);
  };
};

export const useAddOrRemoveStartStation = () => {
  const setStartStations = useConfigStore((store) => store.setStartStations);
  const [searchParams, setSearchParams] = useSearchParams();
  return (startStation: string) => {
    console.log(startStation);
    const searchParamsArray =
      searchParams.get("startStations")?.split(",") ?? [];
    console.log(searchParamsArray);
    if (searchParamsArray.includes(startStation)) {
      searchParamsArray.splice(searchParamsArray.indexOf(startStation), 1);
      searchParamsArray.length > 0
        ? searchParams.set("startStations", searchParamsArray.join(","))
        : searchParams.delete("startStations");
    } else {
      searchParamsArray.push(startStation);
      searchParams.set("startStations", searchParamsArray.join(","));
    }
    setStartStations(searchParamsArray);
    setSearchParams(searchParams);
  };
};

export const useClearStartStations = () => {
  const setStartStations = useConfigStore((store) => store.setStartStations);
  const [searchParams, setSearchParams] = useSearchParams();
  return () => {
    searchParams.delete("startStations");
    setSearchParams(searchParams);
    setStartStations(undefined);
  };
};

export const useUpdateDistance = () => {
  const setDistance = useConfigStore((store) => store.setDistance);
  const [searchParams, setSearchParams] = useSearchParams();
  return (distance: TripDistancesType) => {
    setDistance(distance);
    searchParams.set("distance", distance);
    setSearchParams(searchParams);
  };
};
