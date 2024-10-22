import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import app from "./../../firebase";

const NavBar = () => {
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const [show, setShow] = useState(false);

  const { pathname } = useLocation();

  const img = `http://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/152.png`;

  const handleAuth = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const listener = () => {
    if (window.scrollY > 10) {
      setShow(true);
    } else {
      setShow(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", listener);
    return () => {
      window.removeEventListener("scroll", listener);
    };
  }, []);

  return (
    <div
      className={classNames(
        "fixed top-0 left-0 right-0 h-[70px] flex justify-between items-center px-[36px] z-[100] ",
        {
          "bg-slate-200": show,
          "bg-transparent": !show,
        }
      )}
    >
      <a className="p-0 w-[50px] mt-4" href="/">
        <img className="w-full" src={img} alt="poke logo" />
      </a>
      {pathname === "/login" ? (
        <Link
          className="tracking-[2px] px-[12px] py-[16px] bg-slate-400 uppercase text-white text-sm rounded transition-all duration-300 ease-in-out hover:bg-slate-500"
          to={"/login"}
          onClick={handleAuth}
        >
          Login
        </Link>
      ) : (
        <></>
      )}
    </div>
  );
};

export default NavBar;
