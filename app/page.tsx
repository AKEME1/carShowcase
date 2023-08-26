"use client";

import Image from "next/image";
import { fetchCars } from "@/utils";
import {
  Hero,
  SearchBar,
  CustomeFilter,
  CarCard,
  ShowMore,
} from "@/components";
import { HomeProps } from "@/types";
import { fuels, yearsOfProduction } from "@/constants";
import { useEffect, useState } from "react";
export default function Home() {
  const [allCars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);

  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");

  const [fuel, setFuel] = useState("");
  const [year, setYear] = useState(2022);

  const [limit, setLimit] = useState(10);

  const getCars = async () => {
    setLoading(true);
    try {
      const result = await fetchCars({
        manufacturer: manufacturer || "",
        year: year || 2022,
        fuel: fuel || "",
        limit: limit || 10,
        model: model || "",
      });
      setCars(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCars();
  }, [fuel, year, limit, manufacturer, model]);

  const isDataEmpty = !Array.isArray(allCars) || allCars.length < 1 || !allCars;

  return (
    <main className=" overflow-hidden">
      <Hero />
      <div className="mt-12 padding-x padding-y max-widh" id="discover">
        <div className="home__text-container">
          <h1 className="text-4xl">Car Catalogoye</h1>
          <p>Explore the cars you might link</p>
        </div>
        <div>
          <div className="home__filters">
            <SearchBar setManufacturer={setManufacturer} setModel={setModel} />
            <div className="home__filter-container">
              <CustomeFilter title="fuel" options={fuels} setFilter={setFuel} />
              <CustomeFilter
                title="year"
                options={yearsOfProduction}
                setFilter={setYear}
              />
            </div>
          </div>
        </div>
        {allCars.length > 0 ? (
          <section>
            <div className="home__cars-wrapper">
              {allCars?.map((car) => (
                <CarCard car={car} />
              ))}
            </div>

            {loading && (
              <div className="mt-16 w-full flex-center">
                <Image
                  src="/loader.svg"
                  alt="loader"
                  width={50}
                  height={50}
                  className="object-contain"
                />
              </div>
            )}

            <ShowMore
              pageNumber={limit / 10}
              isNext={limit > allCars.length}
              setLimit={setLimit}
            />
          </section>
        ) : (
          <div className="home__error-container">
            <h2 className="text-black text-xl font-bold">Oops no result</h2>
            <p>{allCars?.message}</p>
          </div>
        )}
      </div>
    </main>
  );
}
