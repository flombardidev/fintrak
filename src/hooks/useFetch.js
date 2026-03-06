import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../features/auth/useAuth";

const BASE_URL = "http://localhost:3001";

export function useFetch(endpoint) {
  const { token } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erreur serveur");
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint, token]);

  useEffect(() => {
    if (token) fetchData();
  }, [fetchData, token]);

  const post = async (body) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Erreur serveur");
    const newItem = await res.json();
    setData((prev) => [...prev, newItem]);
    return newItem;
  };

  const put = async (id, body) => {
    const res = await fetch(`${BASE_URL}${endpoint}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Erreur serveur");
    const updated = await res.json();
    setData((prev) => prev.map((item) => (item.id === id ? updated : item)));
    return updated;
  };

  return { data, loading, error, refetch: fetchData, post, put };
}
