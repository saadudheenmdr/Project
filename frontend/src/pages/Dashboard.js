import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("Valued Member");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        if (userObj.username) {
          const name = userObj.username.charAt(0).toUpperCase() + userObj.username.slice(1);
          setUsername(name);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const quickActions = [
    {
      title: "Book Appointment",
      desc: "Schedule a new service or inspection in just 3 clicks.",
      icon: "📅",
      link: "/book-appointment",
      badge: "Fast Track",
      color: "#2563EB"
    },
    {
      title: "My Vehicles",
      desc: "Manage registration details, models, and service logs.",
      icon: "🚗",
      link: "/my-vehicles",
      badge: "Garage",
      color: "#0EA5E9"
    },
    {
      title: "Service History",
      desc: "Review past maintenance records, bills, and warranties.",
      icon: "📋",
      link: "/appointment-history",
      badge: "Records",
      color: "#10B981"
    },
    {
      title: "Live Support Desk",
      desc: "Connect directly with our Kochi service advisors.",
      icon: "💬",
      link: "#contact",
      badge: "24/7 Help",
      color: "#6366F1"
    }
  ];

  const features = [
    { title: "Online Booking", desc: "Schedule in just 3 clicks with instant confirmation." },
    { title: "Flexible Timing", desc: "Choose your preferred date and time slot seamlessly." },
    { title: "Multi-Brand Service", desc: "Expert care for all car makes and models." },
    { title: "Live Tracking", desc: "Monitor your vehicle's service status in real-time." },
    { title: "Transparent Pricing", desc: "No hidden costs or surprise mechanics bills." },
    { title: "Data Security", desc: "Your personal and vehicle data is fully encrypted." },
    { title: "Mobile Optimized", desc: "Book and track effortlessly from any smartphone." },
    { title: "Genuine Parts", desc: "We use only OEM-certified spare parts and oils." },
  ];

  const services = [
    { name: "Engine Oil Change", icon: "🛢️", desc: "Premium synthetic oil replacement & filter check." },
    { name: "Brake & Suspension", icon: "🛑", desc: "Complete pad, rotor, and fluid inspection." },
    { name: "General Master Service", icon: "🔧", desc: "End-to-end 50-point vehicle health checkup." },
    { name: "Battery & Electricals", icon: "⚡", desc: "Voltage testing, alternator check, & replacement." },
    { name: "3D Wheel Alignment", icon: "⚙️", desc: "Precision laser balancing and steering alignment." },
    { name: "AC Gas Top-up & Clean", icon: "❄️", desc: "Cooling efficiency restoration and duct sanitization." },
    { name: "Comprehensive Inspection", icon: "🔍", desc: "Pre-purchase or seasonal deep vehicle diagnostic." },
    { name: "Custom Detailing", icon: "✨", desc: "Interior deep cleaning and exterior ceramic coating." },
  ];

  const commitments = [
    "100% Genuine OEM Spare Parts Guaranteed",
    "Upfront Transparent Pricing — No Hidden Fees",
    "30-Day Post-Service Service Warranty",
    "Real-Time SMS & Email Status Notifications",
    "Dedicated Customer Support Desk in Kochi",
  ];

  return (
    <div className="dashboard-page">
      <Navbar onLogout={handleLogout} />

      <main className="dashboard-content">
        {/* Personalized Welcome Banner */}
        <section className="dashboard-hero">
          <div className="hero-overlay">
            <div className="welcome-badge">👋 Welcome Back, {username}</div>
            <h1 className="dashboard-title">Driver's Dashboard</h1>
            <p className="dashboard-subtitle">
              Monitor active appointments, manage your registered vehicles, and book certified 
              auto technicians online without waiting in long garage queues.
            </p>
            <div className="hero-status-bar">
              <div className="status-item">
                <span className="status-dot active"></span>
                <span>Kochi Hub: <strong>Open & Operational</strong></span>
              </div>
              <div className="status-item">
                <span>🔧 Schedule a Service Today</span>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions Grid */}
        <section className="quick-actions-section">
          <div className="section-header">
            <h2>What would you like to do today?</h2>
          </div>
          
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <Link to={action.link} className="action-card" key={index}>
                <div className="action-card-header">
                  <span className="action-icon" style={{ backgroundColor: `${action.color}15`, color: action.color }}>
                    {action.icon}
                  </span>
                  <span className="action-badge" style={{ borderColor: `${action.color}40`, color: action.color, backgroundColor: `${action.color}08` }}>
                    {action.badge}
                  </span>
                </div>
                <h3>{action.title}</h3>
                <p>{action.desc}</p>
                <div className="action-arrow">Proceed →</div>
              </Link>
            ))}
          </div>
        </section>

        {/* About Us (Split Layout) */}
        <section className="section about-section grey">
          <div className="about-grid">
            <div className="about-text">
              <span className="sub-heading">ABOUT BOOKMYSERVICE</span>
              <h2>We Are Revolutionizing Vehicle Maintenance</h2>
              <p>
                At <strong>BookMyService</strong>, we combine top-tier mechanical expertise
                with modern digital convenience. Our platform empowers vehicle owners in
                Kochi to schedule comprehensive servicing without the traditional hassle.
              </p>
              <p>
                Whether you need a routine oil change, emergency brake repairs, or custom
                detailing, our centralized system bridges the gap between you and certified,
                state-of-the-art service centers. We prioritize transparency, speed, and
                uncompromising quality.
              </p>
              <div className="stats-row">
                <div className="stat-box">
                  <h3>10,000+</h3>
                  <span>Vehicles Serviced</span>
                </div>
                <div className="stat-box">
                  <h3>99.4%</h3>
                  <span>Satisfaction Rate</span>
                </div>
                <div className="stat-box">
                  <h3>45 mins</h3>
                  <span>Avg. Turnaround</span>
                </div>
              </div>
            </div>
            <div className="about-image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1625047509248-ec889cbff17f?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0"
                alt="Professional mechanic inspecting engine"
                className="about-img"
              />
              <div className="experience-badge">
                <span className="exp-number">15+</span>
                <span className="exp-text">Years of Combined Mechanical Excellence</span>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="section mission-section">
          <div className="mission-grid">
            <div className="card mission-card">
              <div className="card-icon">🎯</div>
              <h3>Our Mission</h3>
              <p>
                To eliminate the friction of auto maintenance by connecting car owners with
                verified, high-tech service centers through an intuitive, transparent, and
                secure digital booking ecosystem.
              </p>
            </div>
            <div className="card vision-card">
              <div className="card-icon">🌍</div>
              <h3>Our Vision</h3>
              <p>
                To become India's most trusted digital automotive service standard, known for
                instant scheduling, uncompromising parts authenticity, and customer-first
                reliability.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="section features-section grey">
          <div className="section-header">
            <span className="sub-heading">THE ADVANTAGE</span>
            <h2>Why Choose BookMyService?</h2>
            <p className="section-desc">
              We built our platform from the ground up to address the most common frustrations
              car owners face with traditional garages.
            </p>
          </div>
          <div className="grid features-grid">
            {features.map((item, index) => (
              <div className="feature-card" key={index}>
                <div className="feature-check">✔</div>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Services Section */}
        <section className="section services-section">
          <div className="section-header">
            <span className="sub-heading">WHAT WE DO</span>
            <h2>Our Comprehensive Services</h2>
            <p className="section-desc">
              From preventive routine checkups to complex mechanical overhauls, our
              partner garages are equipped for every automotive requirement.
            </p>
          </div>
          <div className="grid services-grid">
            {services.map((service, index) => (
              <div className="service-card" key={index}>
                <div className="service-icon">{service.icon}</div>
                <h3>{service.name}</h3>
                <p>{service.desc}</p>
                <Link to="/book-appointment" className="service-link">Book This Service →</Link>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works (Timeline) */}
        <section className="section how-it-works grey">
          <div className="section-header">
            <span className="sub-heading">SIMPLE PROCESS</span>
            <h2>How It Works</h2>
            <p className="section-desc">
              Get your vehicle serviced in five simple, stress-free steps.
            </p>
          </div>
          <div className="steps-container">
            <div className="step-line"></div>
            <div className="steps">
              <div className="step">
                <div className="step-number">01</div>
                <h4>Select Vehicle</h4>
                <p>Choose from your saved garage vehicles or add a new one.</p>
              </div>
              <div className="step">
                <div className="step-number">02</div>
                <h4>Pick Service</h4>
                <p>Select required maintenance, preferred date, and time slot.</p>
              </div>
              <div className="step">
                <div className="step-number">03</div>
                <h4>Instant Approval</h4>
                <p>Receive immediate verification and technician assignment.</p>
              </div>
              <div className="step">
                <div className="step-number">04</div>
                <h4>Track Progress</h4>
                <p>Monitor live updates as our mechanics work on your car.</p>
              </div>
              <div className="step">
                <div className="step-number">05</div>
                <h4>Drive & Relax</h4>
                <p>Pick up your serviced vehicle with a 30-day warranty.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Commitment Banner */}
        <section className="section commitment-section">
          <div className="commitment-box">
            <div className="commitment-content">
              <h2>Our Unshakeable Service Commitment</h2>
              <p>We treat every vehicle as if it were our own. Here is our promise to you:</p>
              <div className="commitments-list">
                {commitments.map((item, index) => (
                  <div className="commitment-item" key={index}>
                    <span className="check-icon">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact / Footer Section */}
        <footer className="contact" id="contact">
          <div className="contact-grid">
            <div className="contact-info">
              <span className="footer-badge">HELP & SUPPORT</span>
              <h1>BookMyService Kochi</h1>
              <p className="tagline">The smart way to care for your car in Kerala.</p>
              <div className="contact-details">
                <p>📍 Shop No. 12, Vyttila Square Complex, Near Vyttila Mobility Hub, Kochi, Kerala - 682019</p>
                <p>📞 +91 90777 20000</p>
                <p>📧 support@bookmyservice.com</p>
              </div>
            </div>
            <div className="contact-hours card-dark">
              <h3>Working Hours</h3>
              <ul className="hours-list">
                <li><span>Monday - Saturday:</span> <span>9:00 AM - 6:30 PM</span></li>
                <li><span>Sunday:</span> <span className="closed">Closed</span></li>
              </ul>
              <div className="footer-cta">
                <Link to="/book-appointment" className="btn btn-primary full-width">
                  Book Priority Appointment
                </Link>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} BookMyService Technologies. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}