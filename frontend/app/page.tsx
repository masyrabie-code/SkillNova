import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="hero">

        <h1>Learn Without Limits</h1>

        <p>
          Master your future with professional online courses.
        </p>

        <div className="buttons">

          <button className="primary">
            Explore Courses
          </button>

          <button className="secondary">
            Become Instructor
          </button>

        </div>

      </main>

      <Footer />
    </>
  );
}
