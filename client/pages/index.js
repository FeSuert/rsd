import Head from "next/head";
import Link from "next/link";
import Layout from "../components/layout";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div>
      <div className="mainmenu">
        <div className="mainpage">Best Multisignature Wallet</div>
        <p className="mainpage" data-item='SuperGnosis'>SuperGnosis</p>

        <section>
          <div className="mainpage">Unlock the power of collective intelligence with us</div>
          <nav className="mainpage">
            <Link className="mainpage-link" href="/dashboard">
              App
            </Link>
            <Link className="mainpage-link" href="/dashboard">
              App
            </Link>
            <Link className="mainpage-link" href="/dashboard">
              App
            </Link>
            <Link className="mainpage-link" href="/dashboard">
              App
            </Link>
            <Link className="mainpage-link" href="/dashboard">
              App
            </Link>
            <Link className="mainpage-link" href="/dashboard">
              App
            </Link>
            <Link className="mainpage-link" href="/dashboard">
              App
            </Link>
            <Link className="mainpage-link" href="/dashboard">
              App
            </Link>
            <Link className="mainpage-link" href="/dashboard">
              App
            </Link>
            <Link className="mainpage-link" href="/dashboard">
              App
            </Link>
            <Link className="mainpage-link" href="/dashboard">
              App
            </Link>
            <Link className="mainpage-link" href="/dashboard">
              App
            </Link>
            <Link className="mainpage-link" href="/dashboard">
              App
            </Link>
            <Link className="mainpage-link" href="/dashboard">
              App
            </Link>
            <Link className="mainpage-link" href="/dashboard">
              App
            </Link>
            <Link className="mainpage-link" href="/dashboard">
              App
            </Link>
            <Link className="mainpage-link" href="/dashboard">
              App
            </Link>
          </nav>

        </section>
      </div>
      <div class="ripple-background">
        <div className="circle xxlarge shade1"></div>
        <div className="circle xlarge shade2"></div>
        <div className="circle large shade3"></div>
        <div className="circle medium shade4"></div>
        <div className="circle small shade5"></div>
      </div>
    </div>
  )
}
