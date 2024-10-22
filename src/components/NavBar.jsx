import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  const [show, setShow] = useState(false);
  console.log(show);

  const img = `http://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/152.png`;

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
          "bg-blue-200": show,
          "bg-transparent": !show,
        }
      )}
    >
      <a className="p-0 w-[50px] mt-4" href="/">
        <img className="w-full" src={img} alt="poke logo" />
      </a>
      <Link className="tracking-[2px]" to={"/login"}>
        Login
      </Link>
    </div>
  );
};

export default NavBar;
