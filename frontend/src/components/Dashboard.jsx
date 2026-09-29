import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const navigate = useNavigate();
    const [diaries, setDiaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingDiary, setEditingDiary] = useState(null);

    // Default image for cards when no image is available
    const defaultImages = [
        'https://images.unsplash.com/photo-1508968419-73cca394e8aa?w=400&h=200&fit=crop',
        'https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=400&h=200&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop',
        'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=200&fit=crop',
    ];

    // Fetch user profile and diaries on component mount
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('diary_token');

            if (!token) {
                navigate('/login');
                return;
            }

            try {
                // Fetch user profile
                const userResponse = await axios.get('http://localhost:5000/api/auth/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(userResponse.data.user);

                // Fetch user's diaries
                await fetchDiaries();
            } catch (error) {
                console.error('Error fetching data:', error);
                if (error.response?.status === 401) {
                    localStorage.removeItem('diary_token');
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem('diary_token');
        localStorage.removeItem('diary_user');
        navigate('/login');
    };

    // Refresh diaries list
    const fetchDiaries = async () => {
        try {
            const token = localStorage.getItem('diary_token');
            const response = await axios.get('http://localhost:5000/api/diaries', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setDiaries(response.data);
        } catch (error) {
            console.error('Error fetching diaries:', error);
            if (error.response?.status === 401) {
                // Token expired or invalid
                localStorage.removeItem('diary_token');
                navigate('/login');
            }
        }
    };

    // Edit diary function
    const handleEditDiary = (diary) => {
        // Store the diary data to be edited in localStorage
        localStorage.setItem('editing_diary', JSON.stringify(diary));
        navigate('/write?edit=true');
    };

    // Delete diary function
    const handleDeleteDiary = async (diaryId) => {
        if (window.confirm("Are you sure you want to delete this diary? This action cannot be undone.")) {
            try {
                const token = localStorage.getItem('diary_token');
                await axios.delete(`http://localhost:5000/api/diaries/${diaryId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchDiaries(); // Refresh the list
            } catch (error) {
                console.error('Error deleting diary:', error);
                alert('Failed to delete diary. Please try again.');
            }
        }
    };

    // Get a random default image
    const getRandomDefaultImage = () => {
        return defaultImages[Math.floor(Math.random() * defaultImages.length)];
    };

    // Mood colors matching LandingPage theme
    const moodColors = {
        happy: '#ec4899',     // Pink (matches LandingPage gradient)
        sad: '#9333ea',       // Purple (matches LandingPage gradient)
        excited: '#f59e0b',   // Amber
        calm: '#10b981',      // Emerald
        angry: '#ef4444',     // Red
        anxious: '#8b5cf6',   // Violet
        tired: '#6b7280',     // Gray
        neutral: '#3b82f6'    // Blue
    };

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.spinner}></div>
                <p style={styles.loadingText}>Loading your memories...</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Header/Navbar - Matching LandingPage */}
            <header style={styles.header}>
                <div style={styles.headerLeft}>
                    <h1 style={styles.logo}>
                        <span style={styles.logoIcon}>📓</span>
                        My Diary Plus
                    </h1>
                    <p style={styles.welcome}>Welcome back, {user?.name}!</p>
                </div>

                <div style={styles.headerRight}>
                    <button
                        onClick={() => navigate('/write')}
                        style={styles.createButton}
                    >
                        <span style={styles.buttonIcon}>✍️</span>
                        New Diary
                    </button>
                    <button onClick={handleLogout} style={styles.logoutButton}>
                        <span style={styles.buttonIcon}>🚪</span>
                        Logout
                    </button>
                </div>
            </header>

            {/* Hero Section - Matching LandingPage Theme */}
            <section style={styles.hero}>
                <div style={styles.heroContent}>
                    <h2 style={styles.heroTitle}>Your Personal Diary Space</h2>
                    <p style={styles.heroSubtitle}>
                        {diaries.length > 0
                            ? `You have ${diaries.length} precious memories saved`
                            : "Start capturing your thoughts and memories today"}
                    </p>
                    <div style={styles.stats}>
                        <div style={styles.statItem}>
                            <span style={styles.statNumber}>{diaries.length}</span>
                            <span style={styles.statLabel}>Total Entries</span>
                        </div>
                        <div style={styles.statDivider}>•</div>
                        <div style={styles.statItem}>
                            <span style={styles.statNumber}>
                                {diaries.filter(d => d.mood === 'happy').length}
                            </span>
                            <span style={styles.statLabel}>Happy Days</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <main style={styles.mainContent}>
                <div style={styles.contentHeader}>
                    <h2 style={styles.sectionTitle}>Your Diary Collection</h2>
                    {diaries.length > 0 && (
                        <div style={styles.controls}>
                            <button
                                onClick={() => navigate('/write')}
                                style={styles.addButton}
                            >
                                <span style={styles.buttonIcon}>+</span>
                                Add New
                            </button>
                        </div>
                    )}
                </div>

                {/* Diary Cards Grid */}
                {diaries.length === 0 ? (
                    <div style={styles.emptyState}>
                        <div style={styles.emptyIcon}>📝</div>
                        <h3 style={styles.emptyTitle}>No diary entries yet</h3>
                        <p style={styles.emptyText}>Your diary is waiting for your first entry!</p>
                        <button
                            onClick={() => navigate('/write')}
                            style={styles.emptyButton}
                        >
                            Write Your First Entry
                        </button>
                    </div>
                ) : (
                    <div style={styles.diaryGrid}>
                        {diaries.map((diary, index) => (
                            <div key={diary._id} style={styles.diaryCard}>
                                {/* Image - Use uploaded image or default */}
                                <div style={styles.imageContainer}>
                                    <img
                                        src={
                                            diary.image
                                                ? `http://localhost:5000/${diary.image}`
                                                : getRandomDefaultImage()
                                        }
                                        alt={diary.title}
                                        style={styles.diaryImage}
                                        onError={(e) => {
                                            e.target.src = getRandomDefaultImage();
                                        }}
                                    />
                                    <div style={{
                                        ...styles.moodTag,
                                        backgroundColor: moodColors[diary.mood] || moodColors.neutral
                                    }}>
                                        {diary.mood.charAt(0).toUpperCase() + diary.mood.slice(1)}
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div style={styles.cardContent}>
                                    <h3 style={styles.diaryTitle}>{diary.title}</h3>
                                    <div style={styles.diaryDate}>
                                        {new Date(diary.createdAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </div>
                                    {/* <div style={styles.diaryExcerpt}>
                                        {diary.content.length > 100
                                            ? `${diary.content.substring(0, 100)}...`
                                            : diary.content}
                                    </div> */}
                                </div>

                                {/* Action Buttons */}
                                <div style={styles.cardActions}>
                                    <button
                                        style={styles.btnEdit}
                                        onClick={() => handleEditDiary(diary)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        style={styles.btnDelete}
                                        onClick={() => handleDeleteDiary(diary._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Footer - Matching LandingPage */}
            <footer style={styles.footer}>
                © 2026 My Diary Plus · Made with ❤️ for your memories
            </footer>
        </div>
    );
};

// Styles matching LandingPage theme
const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fff1f2 0%, #f5f3ff 30%, #ecfeff 100%)',
        color: '#1f2937',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        overflowX: 'hidden'
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #fff1f2 0%, #f5f3ff 30%, #ecfeff 100%)',
    },
    spinner: {
        width: '50px',
        height: '50px',
        border: '4px solid rgba(147, 51, 234, 0.2)',
        borderTop: '4px solid #9333ea',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '20px'
    },
    loadingText: {
        fontSize: '18px',
        color: '#9333ea',
        fontWeight: '500'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 2px 20px rgba(147, 51, 234, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100
    },
    headerLeft: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px'
    },
    logo: {
        fontSize: '28px',
        fontWeight: '800',
        background: 'linear-gradient(90deg, #9333ea, #ec4899)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    logoIcon: {
        fontSize: '28px'
    },
    welcome: {
        fontSize: '14px',
        color: '#6b7280',
        margin: 0
    },
    headerRight: {
        display: 'flex',
        gap: '15px',
        alignItems: 'center'
    },
    createButton: {
        background: 'linear-gradient(90deg, #9333ea, #ec4899)',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '50px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.3s',
        boxShadow: '0 4px 15px rgba(147, 51, 234, 0.4)'
    },
    logoutButton: {
        background: 'rgba(255, 255, 255, 0.9)',
        color: '#9333ea',
        border: '2px solid #9333ea',
        padding: '10px 20px',
        borderRadius: '50px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.3s',
        boxShadow: '0 2px 10px rgba(147, 51, 234, 0.1)'
    },
    buttonIcon: {
        fontSize: '18px'
    },
    hero: {
        textAlign: 'center',
        padding: '60px 20px',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.3))',
        backdropFilter: 'blur(10px)',
        margin: '20px 40px',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)'
    },
    heroContent: {
        maxWidth: '800px',
        margin: '0 auto'
    },
    heroTitle: {
        fontSize: '48px',
        fontWeight: '800',
        background: 'linear-gradient(90deg, #9333ea, #ec4899)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '15px'
    },
    heroSubtitle: {
        fontSize: '18px',
        color: '#6b7280',
        marginBottom: '30px'
    },
    stats: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '30px',
        marginTop: '20px'
    },
    statItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '5px'
    },
    statNumber: {
        fontSize: '36px',
        fontWeight: '800',
        color: '#9333ea'
    },
    statLabel: {
        fontSize: '14px',
        color: '#6b7280',
        fontWeight: '500'
    },
    statDivider: {
        color: '#d1d5db',
        fontSize: '24px'
    },
    mainContent: {
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '20px 40px'
    },
    contentHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px',
        flexWrap: 'wrap',
        gap: '20px'
    },
    sectionTitle: {
        fontSize: '32px',
        fontWeight: '700',
        color: '#1f2937'
    },
    controls: {
        display: 'flex',
        gap: '15px'
    },
    addButton: {
        background: 'white',
        color: '#9333ea',
        border: '2px solid #9333ea',
        padding: '10px 24px',
        borderRadius: '25px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.3s'
    },
    emptyState: {
        textAlign: 'center',
        padding: '80px 20px',
        background: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '20px',
        boxShadow: '0 5px 20px rgba(0, 0, 0, 0.05)',
        backdropFilter: 'blur(10px)'
    },
    emptyIcon: {
        fontSize: '60px',
        marginBottom: '20px'
    },
    emptyTitle: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: '10px'
    },
    emptyText: {
        fontSize: '16px',
        color: '#6b7280',
        marginBottom: '30px'
    },
    emptyButton: {
        background: 'linear-gradient(90deg, #9333ea, #ec4899)',
        color: 'white',
        border: 'none',
        padding: '15px 40px',
        borderRadius: '30px',
        fontSize: '18px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s',
        boxShadow: '0 6px 20px rgba(147, 51, 234, 0.4)'
    },
    diaryGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '25px'
    },
    diaryCard: {
        background: 'white',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s',
        display: 'flex',
        flexDirection: 'column'
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: '200px',
        overflow: 'hidden'
    },
    diaryImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'transform 0.5s'
    },
    moodTag: {
        position: 'absolute',
        top: '15px',
        right: '15px',
        color: 'white',
        padding: '6px 15px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        backdropFilter: 'blur(10px)'
    },
    cardContent: {
        padding: '20px',
        flex: 1
    },
    diaryTitle: {
        fontSize: '20px',
        fontWeight: '700',
        marginBottom: '10px',
        color: '#1f2937'
    },
    diaryDate: {
        fontSize: '14px',
        color: '#6b7280',
        marginBottom: '15px'
    },
    diaryExcerpt: {
        fontSize: '14px',
        color: '#4b5563',
        lineHeight: '1.6'
    },
    cardActions: {
        display: 'flex',
        padding: '15px 20px',
        borderTop: '1px solid #f3f4f6',
        gap: '10px'
    },
    btnEdit: {
        flex: 1,
        padding: '10px',
        background: 'transparent',
        border: '2px solid #9333ea',
        color: '#9333ea',
        borderRadius: '25px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s'
    },
    btnDelete: {
        flex: 1,
        padding: '10px',
        background: 'transparent',
        border: '2px solid #ef4444',
        color: '#ef4444',
        borderRadius: '25px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s'
    },
    footer: {
        textAlign: 'center',
        padding: '40px 20px',
        color: '#9ca3af',
        fontSize: '14px',
        borderTop: '1px solid rgba(0, 0, 0, 0.05)',
        marginTop: '60px'
    }
};

// Add CSS animation
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`, styleSheet.cssRules.length);

// Add hover effects
styleSheet.insertRule(`
  .create-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(147, 51, 234, 0.5);
  }
`, styleSheet.cssRules.length);

styleSheet.insertRule(`
  .logout-button:hover {
    background: rgba(147, 51, 234, 0.1);
    transform: translateY(-2px);
  }
`, styleSheet.cssRules.length);

styleSheet.insertRule(`
  .add-button:hover {
    background: rgba(147, 51, 234, 0.1);
    transform: translateY(-2px);
  }
`, styleSheet.cssRules.length);

styleSheet.insertRule(`
  .empty-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(147, 51, 234, 0.5);
  }
`, styleSheet.cssRules.length);

styleSheet.insertRule(`
  .diary-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  }
`, styleSheet.cssRules.length);

styleSheet.insertRule(`
  .diary-card:hover .diary-image {
    transform: scale(1.05);
  }
`, styleSheet.cssRules.length);

styleSheet.insertRule(`
  .btn-edit:hover {
    background: #9333ea;
    color: white;
  }
`, styleSheet.cssRules.length);

styleSheet.insertRule(`
  .btn-delete:hover {
    background: #ef4444;
    color: white;
  }
`, styleSheet.cssRules.length);

export default Dashboard;