import { useEffect, useState } from "react";
import { MapContainer, GeoJSON } from "react-leaflet";
import mapData from "../assets/countries.json";
import "leaflet/dist/leaflet.css";

const maxBounds = [
  [-90, -180], // Southwest corner
  [90, 180], // Northeast corner
];

const WorldMap = () => {
  const [indicatorData, setIndicatorData] = useState({});
  const [selectedIndicator, setSelectedIndicator] = useState("");
  const [indicators, setIndicators] = useState([]);
  const [selectedColorScale, setSelectedColorScale] = useState(null);

  useEffect(() => {
    fetch("https://global-index-api.onrender.com/records")
      .then((response) => response.json())
      .then((data) => {
        const indicatorTuples = [
          ...new Set(
            data.map((record) => `${record.indicator_code};${record.indicator_name}`)
          ),
        ];
        const parsedIndicators = indicatorTuples.map((tuple) => {
          const [code, name] = tuple.split(";");
          return [code, name];
        });

        setIndicators(parsedIndicators);
      })
      .catch((error) => console.error("Error fetching indicators:", error));
  }, []);

  useEffect(() => {
    if (!selectedIndicator) return;

    fetch(`https://global-index-api.onrender.com/records/indicator/${selectedIndicator}`)
      .then((response) => response.json())
      .then((data) => {
        const dataByCountry = data.reduce((acc, record) => {
          acc[record.country_code] = record.value;
          return acc;
        }, {});

        setIndicatorData(dataByCountry);

        // Calculate the average and standard deviation of the values
        const values = Object.values(dataByCountry);
        const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
        const variance = values.reduce((sum, value) => sum + Math.pow(value - avg, 2), 0) / values.length;
        const stdDev = Math.sqrt(variance);

        // Set the color scale based on the average and standard deviation
        setSelectedColorScale({ avg, stdDev });
      })
      .catch((error) => console.error("Error fetching indicator data:", error));
  }, [selectedIndicator]);

  const getColor = (value) => {
    if (!value || !selectedColorScale) return "#d3d3d3";

    // Use the average and standard deviation to calculate the color
    const { avg, stdDev } = selectedColorScale;

    // Calculate a scale from -3 to +3 standard deviations from the average
    const distFromAvg = (value - avg) / stdDev;

    // Define a color scale from light to dark
    const colorScale = [
      { limit: -3, color: "#9ca0ba" }, // Light color for low values
      { limit: -2, color: "#8c92b8" },
      { limit: -1, color: "#767fb3" },
      { limit: 0, color: "#59639c" },  // Neutral (close to average)
      { limit: 1, color: "#505da1" },
      { limit: 2, color: "#3f4ea1" },
      { limit: 3, color: "#2739a1" },  // Dark color for high values
    ];

    const selectedRange = colorScale.find((range) => distFromAvg <= range.limit);
    return selectedRange ? selectedRange.color : "#d3d3d3";
  };

  const styleFeature = (feature) => {
    const countryCode = feature.properties.ISO_A3;
    const value = indicatorData[countryCode];
    return {
      fillColor: getColor(value),
      weight: 1,
      opacity: 1,
      color: "white",
      fillOpacity: 0.7,
    };
  };

  const downloadCSV = (indicator) => {
    if (!indicator) return;

    const csvContent =
      "data:text/csv;charset=utf-8," +
      Object.entries(indicatorData)
        .map(([countryCode, value]) => `${countryCode},${value}`)
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${indicator}_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="map" className="relative flex flex-col items-center">
      <div className="mb-4 flex gap-2">
        <select
          className="p-2 border border-gray-300 rounded flex-grow max-w-prose"
          onChange={(e) => setSelectedIndicator(e.target.value)}
          value={selectedIndicator}
        >
          <option value="">Select an Indicator</option>
          {indicators.map(([indicatorCode, indicatorName]) => (
            <option key={indicatorCode} value={indicatorCode}>
              {indicatorName}
            </option>
          ))}
        </select>
        <button
          onClick={() => downloadCSV(selectedIndicator)}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={!Object.keys(indicatorData).length}
        >
          Download CSV
        </button>
      </div>

      <MapContainer
        style={{ height: "80vh", width: "100%" }}
        zoom={2}
        center={[0, 0]}
        maxBounds={maxBounds}
        minZoom={2}
        maxZoom={18}
        maxBoundsViscosity={1.0}
      >
        <GeoJSON data={mapData.features} style={styleFeature} />
      </MapContainer>
    </div>
  );
};

export default WorldMap;
