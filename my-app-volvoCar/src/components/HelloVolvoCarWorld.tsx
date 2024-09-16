"use client";
import React, { useEffect, useRef, useState } from "react";
import { createRenderer } from "fela";
import { RendererProvider } from 'react-fela';
import "/public/css/helloVolvoCarWorld.css";
import { Flex } from "vcc-ui";

interface Car {
  id: string;
  modelName: string;
  bodyType: string;
  modelType: string;
  imageUrl: string;
}

export const HelloVolvoCarWorld: React.FC = () => {
  const [cars, setCars] = useState([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  // Category like modelName, bodyType. Specific filter value based on category 
  // & Cars(filteredCars) to be displayed
  const [category, setCategory] = useState<string>("");
  const [subOption, setSubOption] = useState<string>("");
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);

  const renderer = createRenderer();

  useEffect(() => {
    fetch('api/cars.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setCars(data);
        setFilteredCars(data); // Initially set all cars to display
      })
      .catch((error) => console.error('Error loading car data:', error));
  }, []);

  // Scroll Handler
  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  // Get unique sub-options for selected category
  const getSubOptions = () => {
    if (!category) return [];
    return [...new Set(cars.map(car => car[category]))];
  };

  // Handle category selection
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setSubOption('');
    setFilteredCars(cars); // Reset cars to display all before filtering
  };

  // Handle sub-option selection
  const handleSubOptionChange = (e) => {
    setSubOption(e.target.value);
    if (category) {
      const filtered = cars.filter(car => car[category] === e.target.value);
      setFilteredCars(filtered);
    }
  };

  return (
    <RendererProvider renderer={renderer}>
      <div className="container">

        {/* Filter options */}
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="category">Filter by Category: </label>
          <select
            id="category"
            value={category}
            onChange={handleCategoryChange}
          >
            <option value="">Select Category</option>
            <option value="modelName">Model Name</option>
            <option value="bodyType">Body Type</option>
          </select>
        </div>

        {/* Sub-option filter based on category */}
        {category && (
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="subOption">Select {category}: </label>
            <select
              id="subOption"
              value={subOption}
              onChange={handleSubOptionChange}
            >
              <option value="">Select {category}</option>
              {getSubOptions().map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Scrollable Container */}
        <Flex
          ref={scrollRef}
          className="scrollable-container"
        >
          {filteredCars.map((car) => (
            <Flex
              key={car.id}
              className="car-item"
              extend={{ minWidth: "200px", padding: "10px", flex: "0 0 auto" }}
            >
              <p>{car.bodyType}</p>
              <p>
                <strong>{car.modelName}</strong> <span>{car.modelType}</span>
              </p>
              <img
                src={car.imageUrl}
                alt={car.modelName}
                style={{ width: "100%", height: "auto" }}
              />
              <p
                style={{
                  marginTop: "10px",
                  color: "#5a89c2",
                  cursor: "pointer",
                  fontSize: "calc(10px + 0.5vw)",
                }}
              >
                LEARN &gt; SHOP &gt;
              </p>
            </Flex>
          ))}
        </Flex>

        {/* Fixed Position Navigation Buttons */}
        <div className="fixed-buttons">
          <button
            onClick={() => scroll('left')}
            className="button-style"
          >
            {"<"}
          </button>
          <button
            onClick={() => scroll('right')}
            className="button-style"
          >
            {">"}
          </button>
        </div>
      </div>
    </RendererProvider>
  );
};
