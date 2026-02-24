import { Link, Outlet } from "react-router";


export default function FrontendLayout() {
  return (
    <>
      <header>
        <nav className="nav mt-2">
          <Link className="nav-link h4" aria-current="page" to="/">
            首頁
          </Link>
          <Link className="nav-link h4" to="/product">
            產品列表
          </Link>
          <Link className="nav-link h4" to="/cart">
            購物車
          </Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="mt-5 text-center">
        <p>2026 我的網站</p>
      </footer>
    </>
  );
}
