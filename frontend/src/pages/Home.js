import React from "react";
import "../styles/Home.css";

export default function Home() {
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
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <span className="badge">Kochi's #1 Digital Auto Garage</span>
            <h1>BookMyService</h1>
            <p className="hero-tagline">Smart Vehicle Care, Simplified.</p>
            <p className="hero-desc">
              Skip the long garage queues and endless phone calls. Book certified auto
              technicians online, track your vehicle's progress in real-time, and get back
              on the road with complete confidence.
            </p>
            <div className="hero-buttons">
              <a href="/register" className="btn btn-primary">
                Book Service Now
              </a>
              <a href="#services" className="btn btn-outline">
                Explore Services
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section with Image Split */}
      <section className="section about-section">
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
              src="https://images.unsplash.com/photo-1613214149922-f1809c99b414?w=800&auto=format&fit=crop&q=80"
              alt="Professional mechanic inspecting a car engine"
              className="about-img main-img"
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

      {/* Why Choose Us (Features) */}
      <section className="section features-section">
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
      <section className="section services-section grey" id="services">
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
              <a href="/login" className="service-link">Book Now →</a>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works (Timeline) */}
      <section className="section how-it-works">
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
              <h4>Create Account</h4>
              <p>Sign up securely using your email and phone number.</p>
            </div>
            <div className="step">
              <div className="step-number">02</div>
              <h4>Add Vehicle</h4>
              <p>Enter your car brand, model, and registration details.</p>
            </div>
            <div className="step">
              <div className="step-number">03</div>
              <h4>Select Service</h4>
              <p>Pick your required service, preferred date, and time slot.</p>
            </div>
            <div className="step">
              <div className="step-number">04</div>
              <h4>Instant Confirmation</h4>
              <p>Receive immediate verification and service center assignment.</p>
            </div>
            <div className="step">
              <div className="step-number">05</div>
              <h4>Drive & Relax</h4>
              <p>Drop off your vehicle and let our master pros handle the rest.</p>
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

      {/* Footer / Contact Section */}
      <footer className="contact">
        <div className="contact-grid">
          <div className="contact-info">
            <span className="footer-badge">CONTACT US</span>
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
              <a href="/register" className="btn btn-primary full-width">Schedule Emergency Service</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} BookMyService Technologies. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
