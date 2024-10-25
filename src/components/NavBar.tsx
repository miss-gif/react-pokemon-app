import classNames from "classnames";
import {
  User,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import app from "../../firebase";
import storage from "../utils/storage";

const initalUserData = storage.get<User>("userData");

const NavBar = () => {
  const navigate = useNavigate();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const [show, setShow] = useState(false);
  const [userData, setUserData] = useState<User | null>(initalUserData);

  const { pathname } = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
      } else if (user && pathname === "/login") {
        navigate("/");
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const img = `http://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/152.png`;

  const handleAuth = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        setUserData(result.user);
        storage.set("userData", result.user);
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

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        storage.remove("userData");
        setUserData(null);
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
        <div
          className={classNames(
            "relative h-[48px] w-[48px] flex cursor-pointer items-center justify-center group" // group 클래스를 추가
          )}
        >
          {userData?.photoURL && (
            <img
              src={userData.photoURL}
              alt="user photo"
              className="w-full h-full rounded-full"
            />
          )}
          <span
            className="absolute top-12 ring-0 bg-slate-400 rounded shadow p-2 text-xs tracking-[3px] w-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center text-white"
            onClick={handleLogout}
          >
            logout
          </span>
        </div>
      )}
    </div>
  );
};

export default NavBar;
