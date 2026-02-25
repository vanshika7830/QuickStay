import "./Footer.css";

export default function Footer() {
  return (
    
    <footer className="footer" >
      <div className="footerInner" >
        © {new Date().getFullYear()} QuickStay. All rights reserved.
      </div>
    </footer>
  );
}
