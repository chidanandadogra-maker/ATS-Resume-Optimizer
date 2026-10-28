import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />

      <main>{children}</main>

      <Footer />
    </>
  );
}

export default PublicLayout;