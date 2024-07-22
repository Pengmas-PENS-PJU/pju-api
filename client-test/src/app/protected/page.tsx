"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const ProtectedPage = () => {
  const [data, setData] = useState<any | null>([]);
  const router = useRouter();

  const authenticate = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:5000/protected", {
        headers: {
          Authorization: token,
        },
      });
    } catch (error: any) {
      if (error.response.status === 401 || error.response.status === 403) {
        localStorage.removeItem("token");
        router.push("/login");
      }
    }
  };

  useEffect(() => {
    authenticate();
  }, []);

  return (
    <div>
      <h1>Protected Page</h1>
    </div>
  );
};

export default ProtectedPage;
