import React, { useEffect, useState } from "react";
import axios from "../api/axiosConfig";              // ✔ global axios
import { loadConfig } from "../config/runtimeConfig"; // ✔ dynamic backend config
import Slider from "react-slick";
import { Link } from "react-router-dom";

const Home = () => {
  const [hero, setHero] = useState(null);
  const [banners, setBanners] = useState([]);
  const [services, setServices] = useState([]);
  const [backendBase, setBackendBase] = useState("");

  // =====================================================
  // LOAD BACKEND CONFIG + ALL HOME DATA
  // =====================================================
  useEffect(() => {
    async function init() {
      try {
        const cfg = await loadConfig();
        const base = cfg.backend_url.replace("/api", "");
        setBackendBase(base);

        // Hero
        const heroRes = await axios.get("hero/");
        if (heroRes.data.length > 0) setHero(heroRes.data[0]);

        // Banners
        const bannerRes = await axios.get("banners/");
        setBanners(bannerRes.data);

        // Featured services
        const serviceRes = await axios.get("services/");
        setServices(serviceRes.data.slice(0, 4));
      } catch (err) {
        console.error("Home page load error:", err);
      }
    }
    init();
  }, []);

  const settings = {
    dots: true,
    infinite: banners.length > 1,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: banners.length > 1,
    autoplaySpeed: 5000,
    arrows: true,
    pauseOnHover: true,
  };

  return (
    <div style={{ backgroundColor: "#fffafc" }}>
      {/* =====================================================
          HERO SECTION
      ===================================================== */}
      <section
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "left",
          padding: "4rem 2rem",
          gap: "3rem",
          background: "linear-gradient(to bottom, #ffffff, #ffe8f3 80%)",
        }}
      >
        <div style={{ maxWidth: "500px" }}>
          <h1
            style={{
              fontSize: "3rem",
              color: "var(--brand-pink)",
              fontWeight: "700",
            }}
          >
            {hero ? hero.title : "Healthcare for women, by women."}
          </h1>

          <p
            style={{
              color: "#4a0e33",
              lineHeight: "1.6",
              margin: "1rem 0 2rem",
            }}
          >
            {hero
              ? hero.subtitle
              : "Compassionate, comprehensive care — designed by women, for women."}
          </p>

          <Link
            to="/services"
            style={{
              padding: "0.8rem 1.8rem",
              backgroundColor: "var(--brand-pink)",
              color: "white",
              borderRadius: "25px",
              textDecoration: "none",
              fontWeight: "600",
              boxShadow: "0 3px 6px rgba(155, 53, 109, 0.2)",
            }}
          >
            {hero ? hero.button_text : "Explore Our Services"}
          </Link>
        </div>

        {hero && hero.image ? (
          <img
            src={
              hero.image.startsWith("http")
                ? hero.image
                : `${backendBase}${hero.image}`
            }
            alt="Hero"
            style={{
              width: "400px",
              borderRadius: "20px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          />
        ) : (
          <div
            style={{
              width: "400px",
              height: "300px",
              borderRadius: "20px",
              backgroundColor: "#ffe8f3",
            }}
          ></div>
        )}
      </section>

      {/* =====================================================
          BANNER SLIDER
      ===================================================== */}
      <section
        style={{
          margin: "3rem auto",
          maxWidth: "1100px",
          padding: "0 2rem",
          textAlign: "center",
        }}
      >
        {banners.length > 0 ? (
          <Slider {...settings}>
            {banners.slice(0, 5).map((banner) => (
              <div key={banner.id} style={{ position: "relative" }}>
                <img
                  src={
                    banner.image.startsWith("http")
                      ? banner.image
                      : `${backendBase}${banner.image}`
                  }
                  alt={banner.title || "Womb & Wonder Banner"}
                  style={{
                    width: "100%",
                    borderRadius: "20px",
                    height: "450px",
                    objectFit: "cover",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  }}
                />

                {banner.title && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "2rem",
                      left: "50%",
                      transform: "translateX(-50%)",
                      backgroundColor: "rgba(155, 53, 109, 0.85)",
                      color: "white",
                      padding: "0.5rem 1.25rem",
                      borderRadius: "30px",
                      fontWeight: "600",
                    }}
                  >
                    {banner.title}
                  </div>
                )}
              </div>
            ))}
          </Slider>
        ) : (
          <p style={{ textAlign: "center", color: "#555" }}>
            No banners uploaded yet.
          </p>
        )}
      </section>

      {/* =====================================================
          FEATURED SERVICES
      ===================================================== */}
      <section
        style={{
          backgroundColor: "#fdf2f7",
          padding: "4rem 2rem",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            color: "var(--brand-pink)",
            fontSize: "2rem",
            fontWeight: "700",
            marginBottom: "2rem",
          }}
        >
          Featured Services
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.5rem",
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          {services.length > 0 ? (
            services.map((service) => (
              <div
                key={service.id}
                style={{
                  backgroundColor: "white",
                  borderRadius: "16px",
                  padding: "2rem 1.5rem",
                  boxShadow: "0 3px 8px rgba(0,0,0,0.05)",
                  border: "1px solid #f3e4ec",
                  transition: "0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-6px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0px)")
                }
              >
                <h3
                  style={{
                    color: "var(--text-dark)",
                    fontWeight: "600",
                    fontSize: "1.25rem",
                    marginBottom: "1rem",
                  }}
                >
                  {service.name}
                </h3>

                <p
                  style={{
                    color: "#555",
                    lineHeight: "1.6",
                    fontSize: "0.95rem",
                  }}
                >
                  {service.description}
                </p>

                <p
                  style={{
                    color: "var(--brand-pink)",
                    fontWeight: "700",
                    fontSize: "1.1rem",
                    marginTop: "1rem",
                  }}
                >
                  ₱{service.price}
                </p>

                <Link
                  to="/services"
                  style={{
                    display: "inline-block",
                    marginTop: "1rem",
                    padding: "0.5rem 1.25rem",
                    border: "2px solid var(--brand-pink)",
                    borderRadius: "25px",
                    textDecoration: "none",
                    color: "var(--brand-pink)",
                    fontWeight: "600",
                  }}
                >
                  Book Now
                </Link>
              </div>
            ))
          ) : (
            <p>No services available yet.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
