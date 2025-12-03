function Footer() {
  return (
    <footer className="border-t py-4">
      <div className="container text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} ProjectSync. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
