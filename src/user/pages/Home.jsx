import "./Home.css";
const API = import.meta.env.VITE_API_URL;
export default function Home() {
  return (
    <div className="home">
      {/* HERO */}
      <section className="hero">
        <div className="heroInner">
          <p className="heroTag" data-aos="fade-down">
            Find your next stay
          </p>

          <h1 className="heroTitle" data-aos="fade-up">
            Discover <span>beautiful hotels</span> and book instantly
          </h1>

          <p className="heroSub" data-aos="fade-up" data-aos-delay="150">
            Explore premium stays, best prices, and smooth booking — all in one place.
          </p>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="section">
        <div className="sectionHeader">
          <h2>Why QuickStay?</h2>
          <p>Everything you need for a smooth booking experience.</p>
        </div>

        <div className="whyGrid">
          <div className="whyCard" data-aos="fade-up" data-aos-delay="0">
            <h3>Best Prices</h3>
            <p>Get the best deals on premium hotels and stays.</p>
          </div>

          <div className="whyCard" data-aos="fade-up" data-aos-delay="120">
            <h3>Verified Hotels</h3>
            <p>Only trusted and verified listings for your safety.</p>
          </div>

          <div className="whyCard" data-aos="fade-up" data-aos-delay="240">
            <h3>Instant Booking</h3>
            <p>Book within seconds and enjoy seamless checkout.</p>
          </div>
        </div>
      </section>
    </div>
  );
}