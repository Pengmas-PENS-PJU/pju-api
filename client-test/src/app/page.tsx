"use client";
import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import axios from "axios";

const socket: Socket = io("http://localhost:5000");

interface SensorData {
  id: number;
  value: number;
  sensorType: {
    name: string;
    unit: string;
  };
}

export default function Home() {
  const [data, setData] = useState<SensorData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/data");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDataUpdate = async (newData: SensorData) => {
    setIsUpdating(true);
    // setData((prevData) => [newData, ...prevData]);
    await fetchData();
    setIsUpdating(false);
  };

  useEffect(() => {
    fetchData();

    socket.on("dataUpdate", handleDataUpdate);

    return () => {
      socket.off("dataUpdate");
    };
  }, []);

  return (
    <div>
      <h1>Realtime Data</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {isUpdating && <p>Updating...</p>}
          <ul>
            {data.map((item) => (
              <li key={item.id}>
                {item.sensorType?.name}: {item.value} {item.sensorType?.unit}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
