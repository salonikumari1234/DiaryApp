import React from 'react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();
  
  const features = [
    {
      icon: '📖',
      title: 'Write Freely',
      desc: 'Let your thoughts flow with rich text, images, and moods.'
    },
    {
      icon: '🔒',
      title: 'Private & Secure',
      desc: 'Your diary is encrypted and accessible only by you.'
    },
    {
      icon: '🎨',
      title: 'Customize',
      desc: 'Themes, colors, and layouts that match your personality.'
    }
  ];

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <h1 style={styles.logo}>My Diary Plus</h1>
        <div style={styles.navButtons}>
          <button onClick={() => navigate('/login')} style={styles.loginButton}>Login</button>
          <button 
            onClick={() => navigate('/signup')}
            style={styles.signupButton}
          >
            Sign Up
          </button>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.iconCircle}>
          <span style={styles.heart}>❤️</span>
        </div>
        
        <h1 style={styles.heroTitle}>Write your own life</h1>
        <p style={styles.heroSubtitle}>in your way</p>
        
        <p style={styles.heroDesc}>
          A calm and beautiful space to capture your thoughts, emotions, and memories—every single day.
        </p>
        
        <div style={styles.heroButtons}>
          <button 
            onClick={() => navigate('/login')}
            style={styles.primaryButton}
          >
            Start Writing
          </button>
          <button onClick={() => navigate('/signup')} style={styles.secondaryButton}>
            Sign In
          </button>
        </div>
      </section>
      
      {/* Features Section */}
      <section style={styles.features}>
        <h2 style={styles.featuresTitle}>Features</h2>
        <div style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} style={styles.featureCard}>
              <div style={styles.featureIcon}>
                {feature.icon}
              </div>
              <h3 style={styles.featureTitle}>{feature.title}</h3>
              <p style={styles.featureDesc}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Footer */}
      <footer style={styles.footer}>
        © 2026 My Diary Plus · Made with ❤️ for your memories
      </footer>
    </div>
  );
}

// Styles object
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #fff1f2 0%, #f5f3ff 50%, #ecfeff 100%)',
    color: '#333',
    fontFamily: 'Arial, sans-serif',
    overflowX: 'hidden'
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)'
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#9333ea',
    margin: 0
  },
  navButtons: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center'
  },
  loginButton: {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    color: '#666',
    cursor: 'pointer',
    padding: '8px 16px',
    borderRadius: '20px',
    transition: 'all 0.3s'
  },
  signupButton: {
    background: 'linear-gradient(90deg, #9333ea, #ec4899)',
    color: 'white',
    border: 'none',
    padding: '10px 24px',
    borderRadius: '25px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(147, 51, 234, 0.3)',
    transition: 'transform 0.3s'
  },
  hero: {
    textAlign: 'center',
    padding: '60px 20px',
    maxWidth: '800px',
    margin: '0 auto'
  },
  iconCircle: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 30px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
  },
  heart: {
    fontSize: '40px'
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: 'bold',
    margin: '10px 0',
    background: 'linear-gradient(90deg, #9333ea, #ec4899)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  heroSubtitle: {
    fontSize: '24px',
    color: '#666',
    margin: '10px 0 20px'
  },
  heroDesc: {
    fontSize: '18px',
    color: '#777',
    lineHeight: '1.6',
    margin: '20px auto',
    maxWidth: '600px'
  },
  heroButtons: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    marginTop: '40px'
  },
  primaryButton: {
    background: 'linear-gradient(90deg, #9333ea, #ec4899)',
    color: 'white',
    border: 'none',
    padding: '15px 40px',
    borderRadius: '30px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 6px 20px rgba(147, 51, 234, 0.4)',
    transition: 'transform 0.3s'
  },
  secondaryButton: {
    background: 'transparent',
    color: '#9333ea',
    border: '2px solid #9333ea',
    padding: '15px 40px',
    borderRadius: '30px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  features: {
    padding: '60px 20px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  featuresTitle: {
    textAlign: 'center',
    fontSize: '32px',
    marginBottom: '50px',
    color: '#333'
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
    padding: '0 20px'
  },
  featureCard: {
    background: 'rgba(255, 255, 255, 0.8)',
    padding: '40px 30px',
    borderRadius: '20px',
    textAlign: 'center',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s'
  },
  featureIcon: {
    fontSize: '40px',
    marginBottom: '20px'
  },
  featureTitle: {
    fontSize: '24px',
    margin: '10px 0',
    color: '#333'
  },
  featureDesc: {
    color: '#666',
    lineHeight: '1.6',
    fontSize: '16px'
  },
  footer: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#999',
    fontSize: '14px',
    borderTop: '1px solid rgba(0, 0, 0, 0.1)',
    marginTop: '40px'
  }
};

// Hover effects
Object.assign(styles.loginButton, {
  ':hover': {
    color: '#9333ea',
    background: 'rgba(147, 51, 234, 0.1)'
  }
});

Object.assign(styles.signupButton, {
  ':hover': {
    transform: 'scale(1.05)'
  }
});

Object.assign(styles.primaryButton, {
  ':hover': {
    transform: 'scale(1.05)'
  }
});

Object.assign(styles.secondaryButton, {
  ':hover': {
    background: 'rgba(147, 51, 234, 0.1)'
  }
});

Object.assign(styles.featureCard, {
  ':hover': {
    transform: 'translateY(-10px)'
  }
});

export default LandingPage;