import { useEffect, useState } from "react";
import axios from "axios";
import DiaryForm from "./DiaryForm";
import DiaryList from "./DiaryList";

export default function DiaryPage() {
  const [diaries, setDiaries] = useState([]);

  const fetchDiaries = async () => {
    const res = await axios.get("http://localhost:5000/api/diaries");
    setDiaries(res.data);
  };

  useEffect(() => {
    fetchDiaries();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <DiaryForm fetchDiaries={fetchDiaries} />
      <DiaryList diaries={diaries} fetchDiaries={fetchDiaries} />
    </div>
  );
}
