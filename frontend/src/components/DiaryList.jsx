import axios from "axios";

function DiaryList({ diaries, fetchDiaries, onEdit }) {
  const deleteDiary = async (id) => {
    if (!window.confirm("Are you sure you want to delete this diary?")) return;
    await axios.delete(`http://localhost:5000/api/diaries/${id}`);
    fetchDiaries();
  };

  return (
    <>
      <style>{`
        .diary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
          padding: 20px;
        }

        .diary-card {
          background: #fffdf6;
          border-radius: 12px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.12);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.25s ease;
        }

        .diary-card:hover {
          transform: translateY(-6px);
        }

        .diary-image {
          width: 100%;
          height: 180px;
          background: #eee;
          overflow: hidden;
        }

        .diary-image img {
          width: 100%;
          height: 100%;
          object-fit: stretch;
        }

        .diary-content {
          padding: 16px;
          flex: 1;
        }

        .diary-title {
          font-size: 18px;
          font-weight: bold;
          color: #333;
          margin-bottom: 6px;
        }

        .diary-date {
          font-size: 13px;
          color: #777;
          margin-bottom: 10px;
        }

        .diary-mood {
          font-size: 14px;
          color: #555;
        }

        /* ACTION BUTTONS */
        .card-actions {
          display: flex;
          gap: 10px;               /* SPACE BETWEEN BUTTONS */
          padding: 14px;
          border-top: 1px solid #eee;
          background: #fff;
        }

        .btn {
          flex: 1;
          padding: 10px 0;
          font-size: 14px;
          font-weight: 600;
          border-radius: 999px;    /* ROUNDED BUTTONS */
          background: transparent;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .btn-edit {
          color: #4a6cf7;
          border: 2px solid #4a6cf7;
        }

        .btn-edit:hover {
          background: #4a6cf7;
          color: white;
        }

        .btn-delete {
          color: #e63946;
          border: 2px solid #e63946;
        }

        .btn-delete:hover {
          background: #e63946;
          color: white;
        }
      `}</style>

      <div className="diary-grid">
        {diaries.map((diary) => (
          <div className="diary-card" key={diary._id}>

            {/* IMAGE */}
            {diary.image && (
              <div className="diary-image">
                <img
                  src={`http://localhost:5000/${diary.image}`}
                  alt={diary.title}
                />
              </div>
            )}

            {/* CONTENT */}
            <div className="diary-content">
              <div className="diary-title">{diary.title}</div>
              <div className="diary-date">
                {new Date(diary.createdAt).toDateString()}
              </div>
              <div className="diary-mood">
                Mood: <strong>{diary.mood}</strong>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="card-actions">
              <button
                className="btn btn-edit"
                onClick={() => onEdit(diary)}
              >
                Edit
              </button>

              <button
                className="btn btn-delete"
                onClick={() => deleteDiary(diary._id)}
              >
                Delete
              </button>
            </div>

          </div>
        ))}
      </div>
    </>
  );
}

export default DiaryList;
