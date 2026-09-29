import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function DiaryForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("neutral");
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [diaryId, setDiaryId] = useState("");

  const writingAreaRef = useRef(null);
  const underlinedRef = useRef(null);

  // Check if we're in edit mode
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const editMode = query.get('edit');
    
    if (editMode) {
      const savedDiary = localStorage.getItem('editing_diary');
      if (savedDiary) {
        const diary = JSON.parse(savedDiary);
        setIsEditMode(true);
        setDiaryId(diary._id);
        setTitle(diary.title || "");
        setContent(diary.content || "");
        setMood(diary.mood || "neutral");
        setExistingImage(diary.image || "");
        
        // Clear the stored diary after loading
        localStorage.removeItem('editing_diary');
      }
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('diary_token');
    if (!token) {
      navigate('/login');
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("mood", mood);
    if (image) formData.append("image", image);

    try {
      if (isEditMode) {
        // Update existing diary
        await axios.put(`http://localhost:5000/api/diaries/${diaryId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
          },
        });
      } else {
        // Create new diary
        await axios.post("http://localhost:5000/api/diaries", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
          },
        });
      }

      // Reset form and navigate back
      setTitle("");
      setContent("");
      setMood("neutral");
      setImage(null);
      setExistingImage("");
      setIsEditMode(false);
      setDiaryId("");
      
      // Navigate back to dashboard
      navigate('/dashboard');

    } catch (error) {
      console.error("Error saving diary:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem('diary_token');
        navigate('/login');
      } else {
        alert(`Failed to save diary: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Dynamically generate lines for right page
  const updateLines = () => {
    if (!writingAreaRef.current || !underlinedRef.current) return;
    const lineHeight = 26;
    const scrollHeight = writingAreaRef.current.scrollHeight;
    const lineCount = Math.ceil(scrollHeight / lineHeight);
    underlinedRef.current.innerHTML = "";
    for (let i = 1; i <= lineCount; i++) {
      const line = document.createElement("div");
      line.className = "underlined-line";
      const lineNumber = document.createElement("div");
      lineNumber.className = "line-number";
      lineNumber.textContent = i;
      //line.appendChild(lineNumber);
      underlinedRef.current.appendChild(line);
    }
  };

  useEffect(() => {
    updateLines();
  }, [content]);

  useEffect(() => {
    if (writingAreaRef.current) {
      writingAreaRef.current.addEventListener("scroll", () => {
        if (underlinedRef.current) {
          underlinedRef.current.scrollTop = writingAreaRef.current.scrollTop;
        }
      });
    }
  }, []);

  // Add image preview for existing images
  const renderImagePreview = () => {
    if (image) {
      return <img src={URL.createObjectURL(image)} alt="uploaded" />;
    } else if (existingImage) {
      return <img src={`http://localhost:5000/${existingImage}`} alt="diary" />;
    } else {
      return (
        <>
          <div className="image-icon">📷</div>
          <div className="image-text">Click to upload an image</div>
        </>
      );
    }
  };

  return (
    <>
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; font-family:'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
        body, html { width:100%; height:100%; }

        .container {
          width: 100%;
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
        }

        .form-header {
          text-align: center;
          margin-bottom: 30px;
          padding: 20px;
          background: linear-gradient(90deg, #9333ea, #ec4899);
          color: white;
          border-radius: 15px;
          box-shadow: 0 5px 20px rgba(147, 51, 234, 0.3);
        }

        .form-header h1 {
          font-size: 28px;
          margin-bottom: 10px;
        }

        .form-header p {
          font-size: 16px;
          opacity: 0.9;
        }

        .notebook {
          display: flex;
          width: 100%;
          height: 550px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
          border-radius: 15px;
          overflow: hidden;
          background: white;
          border: 1px solid #e0e0e0;
        }

        .page-left {
          flex: 1;
          padding: 40px;
          border-right: 1px solid #e0e0e0;
          display: flex;
          flex-direction: column;
          background: #fffdf6;
          overflow-y: auto;
        }

        .topic-section, .date-section, .image-section, .mood-section {
          margin-bottom: 30px;
        }

        .topic-label, .date-label, .image-label, .mood-label {
          font-size: 14px;
          color: #666;
          font-weight: 600;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .topic-input {
          width: 100%;
          font-size: 28px;
          font-weight: 800;
          color: #333;
          border: none;
          outline: none;
          padding: 8px 0;
          background: transparent;
          font-family: 'Georgia', serif;
        }

        .topic-input::placeholder { 
          color: #aaa;
          font-weight: 400;
        }

        .topic-line { 
          width:100%; 
          height:2px; 
          background: linear-gradient(90deg, #4a6cf7, #ec4899);
          margin-top:8px; 
          border-radius: 1px;
        }

        .date-display { 
          font-size:16px; 
          color:#666;
          font-weight: 500;
          padding: 8px 12px;
          background: #f8f9ff;
          border-radius: 8px;
          display: inline-block;
        }

        .image-box {
          width: 100%;
          height: 180px;
          border: 2px dashed #4a6cf7;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8f9ff;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s ease;
          position: relative;
        }

        .image-box:hover { 
          border-color:#ec4899; 
          background:#fff5f7;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(236, 72, 153, 0.2);
        }

        .image-box img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        .image-icon { 
          font-size:40px;
          color:#4a6cf7;
          margin-bottom:10px;
          opacity: 0.7;
        }
        .image-text { 
          font-size:14px;
          color:#666;
          font-weight: 500;
        }

        .mood-section {
          margin-bottom: 0;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }

        .mood-select-container {
          position: relative;
          width: 100%;
          flex-grow: 1;
        }

        .mood-select {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          font-size: 15px;
          color:#333;
          background:white;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23333%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
          background-repeat: no-repeat;
          background-position: right 16px top 50%;
          background-size: 12px auto;
          padding-right: 40px;
        }
        
        .mood-select:focus { 
          outline:none; 
          border-color:#4a6cf7;
          box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
        }
        
        .mood-select option {
          padding: 10px;
          font-size: 14px;
        }

        .page-right {
          flex:1;
          padding:40px 40px 40px 50px;
          position:relative;
          background:#fffdf6;
          overflow:hidden;
        }

        .margin-line {
          position:absolute;
          left:35px; 
          top:40px; 
          bottom:40px; 
          width:1px;
          background: repeating-linear-gradient(
            to bottom, 
            transparent, 
            transparent 24px, 
            #d0e6ff 24px, 
            #d0e6ff 26px
          );
        }

        .underlined-content { 
          position:relative; 
          height:100%; 
          width:100%;
        }
        .underlined-lines {
          position:absolute;
          top:0; 
          left:0; 
          width:100%;
          display:flex; 
          flex-direction:column;
          pointer-events:none;
        }
        .underlined-line {
          flex:0 0 26px;
          border-bottom:1px solid #e8f4ff;
          position:relative;
        }
        .line-number {
          position:absolute;
          left:-35px; 
          top:50%;
          transform:translateY(-50%);
          color:#999; 
          fontSize:12px;
          fontFamily: 'Courier New', monospace;
        }
        .writing-area {
          position:absolute; 
          top:0; 
          left:0; 
          width:100%; 
          height:100%;
          padding-left:5px;
          border:none; 
          outline:none; 
          resize:none;
          fontSize:16px; 
          lineHeight:26px;
          fontFamily:'Georgia', serif;
          background:transparent; 
          overflow-y:auto;
          color: #333;
        }
        .writing-area::placeholder {
          color: #aaa;
          font-style: italic;
        }

        /* CONTROLS SECTION */
        .controls { 
          display:flex; 
          justify-content:center; 
          align-items: center;
          gap:20px; 
          margin-top:40px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 15px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.08);
        }
        
        .btn { 
          padding:15px 40px; 
          border:none; 
          border-radius:50px; 
          fontSize:16px; 
          fontWeight:600; 
          cursor:pointer; 
          display:flex; 
          align-items:center; 
          justify-content: center;
          gap:10px; 
          transition:all 0.3s ease;
          min-width: 180px;
          letter-spacing: 0.5px;
        }
        
        .btn-save { 
          background: linear-gradient(90deg, #4a6cf7, #ec4899);
          color:white;
          box-shadow: 0 6px 20px rgba(74, 108, 247, 0.3);
          fontWeight: 700;
        }
        
        .btn-save:hover { 
          background: linear-gradient(90deg, #3a5ce5, #db2777);
          transform:translateY(-3px);
          box-shadow: 0 10px 25px rgba(74, 108, 247, 0.4);
        }
        
        .btn-save:disabled {
          background: #ccc;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
          opacity: 0.7;
        }
        
        .btn-save:active {
          transform:translateY(-1px);
        }

        .btn-cancel {
          background: #6b7280;
          color: white;
        }

        .btn-cancel:hover {
          background: #4b5563;
          transform: translateY(-3px);
        }
        
        /* Loading spinner */
        .spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .notebook {
            flex-direction: column;
            height: auto;
          }
          
          .page-left, .page-right {
            padding: 25px;
          }
          
          .controls {
            flex-direction: column;
            gap: 15px;
          }
          
          .btn {
            width: 100%;
          }
          
          .mood-select {
            fontSize: 14px;
            padding: 10px 12px;
          }
        }
      `}</style>

      <div className="container">
        <div className="form-header">
          <h1>{isEditMode ? 'Edit Diary Entry' : 'Create New Diary Entry'}</h1>
          <p>{isEditMode ? 'Update your memories below' : 'Capture your thoughts and feelings below'}</p>
        </div>

        <div className="notebook">

          {/* LEFT PAGE */}
          <div className="page-left">
            <div className="topic-section">
              <div className="topic-label">Topic</div>
              <input
                type="text"
                className="topic-input"
                placeholder="What's on your mind today?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="topic-line"></div>
            </div>

            <div className="date-section">
              <div className="date-label">Date</div>
              <div className="date-display">{new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</div>
            </div>

            <div className="image-section">
              <div className="image-label">Add an Image</div>
              <div className="image-box" onClick={() => document.getElementById("fileInput").click()}>
                {renderImagePreview()}
                <input
                  type="file"
                  id="fileInput"
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={(e) => {
                    setImage(e.target.files[0]);
                    setExistingImage(""); // Clear existing image if new one is uploaded
                  }}
                />
              </div>
              {existingImage && !image && (
                <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                  <button 
                    onClick={() => {
                      setExistingImage("");
                      document.getElementById("fileInput").click();
                    }}
                    style={{
                      background: 'none',
                      border: '1px solid #ef4444',
                      color: '#ef4444',
                      padding: '5px 10px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Remove current image
                  </button>
                </div>
              )}
            </div>

            <div className="mood-section">
              <div className="mood-label">How are you feeling?</div>
              <div className="mood-select-container">
                <select 
                  className="mood-select" 
                  value={mood} 
                  onChange={(e) => setMood(e.target.value)}
                >
                  <option value="neutral">😐 Neutral</option>
                  <option value="happy">😊 Happy</option>
                  <option value="sad">😢 Sad</option>
                  <option value="excited">🤩 Excited</option>
                  <option value="calm">😌 Calm</option>
                  <option value="angry">😠 Angry</option>
                  <option value="anxious">😰 Anxious</option>
                  <option value="tired">😴 Tired</option>
                </select>
              </div>
            </div>
          </div>

          {/* RIGHT PAGE */}
          <div className="page-right">
            <div className="margin-line"></div>
            <div className="underlined-content">
              <div className="underlined-lines" ref={underlinedRef}></div>
              <textarea
                className="writing-area"
                ref={writingAreaRef}
                placeholder="Pour your heart out here... Write freely about your day, thoughts, and feelings..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="10"
              ></textarea>
            </div>
          </div>

        </div>

        {/* CONTROLS SECTION */}
        <div className="controls">
          <button 
            className="btn btn-save" 
            onClick={handleSubmit}
            disabled={loading || !title.trim() || !content.trim()}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                {isEditMode ? 'Updating...' : 'Saving...'}
              </>
            ) : (
              <>
                <span style={{ fontSize: '18px' }}>💾</span>
                {isEditMode ? 'Update Entry' : 'Save Entry'}
              </>
            )}
          </button>
          
          <button
            className="btn btn-cancel"
            onClick={() => navigate('/dashboard')}
          >
            Cancel
          </button>
          
          <div style={{ color: '#666', fontSize: '14px', textAlign: 'center' }}>
            {!title.trim() || !content.trim() ? (
              <p style={{ color: '#f59e0b' }}>⚠️ Add a title and content to save</p>
            ) : (
              <p>{isEditMode ? 'Ready to update your memories ✨' : 'Ready to save your memories ✨'}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default DiaryForm;