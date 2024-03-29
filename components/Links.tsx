import { RiBook2Fill, RiChat3Fill, RiUserSettingsLine } from "react-icons/ri";
import { useAppDispatch, useAppSelector } from "../hooks/store.hook";
import { FaCaretDown, FaPowerOff } from "react-icons/fa";
import { CSSTransition } from "react-transition-group";
import { TbActivityHeartbeat } from "react-icons/tb";
import { setRest } from "../store/slice/auth.slice";
import animate from "../styles/animate.module.css";
import constants from "../config/constant.config";
import { client } from "../graphql/apolloClient";
import styles from "../styles/Home.module.scss";
import { BiCheckShield } from "react-icons/bi";
import { useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const Links = () => {
  const isAuth = useAppSelector((state) => state.auth.isAuth);
  const token = useAppSelector((state) => state.auth.token);
  const { defaultImg, beHost } = constants;
  const nodeRefLogout = useRef<any>(null);
  const nodeRef = useRef<any>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const role = useAppSelector(
    (state) =>
      state.auth?.userAdminData?.user ||
      state.auth?.userStudData?.user ||
      state.auth?.userSupData?.user ||
      state.auth?.userCoordData?.user ||
      state.auth?.userOrgData?.user
  );

  const [dropDown, setDropDown] = useState({
    user: false,
    profile: false,
    chat: false,
  });

  const logout = () => {
    localStorage.removeItem("logBookData");
    // Reset Apollo Cache
    client.resetStore();
    dispatch(setRest());
    router.push("/login");
  };

  const name: string = useAppSelector(
    (state) =>
      state.auth?.userAdminData?.firstName ||
      state.auth?.userCoordData?.firstName ||
      state.auth?.userSupData?.firstName ||
      state.auth?.userStudData?.firstName ||
      state.auth?.userOrgData?.name?.split(" ")[0]
  );

  const avatar: string = useAppSelector(
    (state) =>
      state.auth?.userAdminData?.avatar ||
      state.auth?.userCoordData?.avatar ||
      state.auth?.userSupData?.avatar ||
      state.auth?.userStudData?.avatar ||
      state.auth?.userOrgData?.logo
  );

  const splitURL = avatar?.split("/")[2];
  const cloudinary = splitURL?.split(".")[1];

  return (
    <div className={styles.nav_div}>
      <Link href="/">
        <a
          className={[
            styles.nav_li,
            router.pathname === "/" ? styles.active : "",
          ].join(" ")}
        >
          Home
        </a>
      </Link>

      <Link href="/blog/blog-post">
        <a
          className={[
            styles.nav_li,
            router.pathname.split("/")[1] === "blog" ? styles.active : "",
          ].join(" ")}
        >
          Blog
        </a>
      </Link>

      {!(isAuth && token) ? (
        <>
          <Link href="/login">
            <a
              className={[
                styles.nav_li,
                router.pathname === "/login" ? styles.active : "",
              ].join(" ")}
            >
              Login
            </a>
          </Link>

          <div className={styles.nav_li}>
            <button
              onClick={() =>
                setDropDown((prev) => ({
                  user: !prev.user,
                  profile: prev.profile,
                  chat: prev.profile,
                }))
              }
              className={[
                styles.dropdownBtn,
                router.pathname.split("/")[1] === "signup" ? styles.active : "",
              ].join(" ")}
            >
              <div>
                Signup <FaCaretDown />
              </div>
              <CSSTransition
                nodeRef={nodeRef}
                mountOnEnter
                unmountOnExit
                in={dropDown.user}
                timeout={400}
                classNames={{
                  enterActive: animate.signupEnterActive,
                  exitActive: animate.signupExitActive,
                }}
              >
                <ul ref={nodeRef} className={styles.dropdown_content}>
                  <li>
                    <Link href="/signup/organisation">
                      <a
                        className={[
                          styles.dropdownBtn,
                          router.pathname.split("/")[2] === "organisation"
                            ? styles.active
                            : "",
                        ].join(" ")}
                      >
                        <div className="m-0 p-0">Organisation</div>
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/signup/coordinator">
                      <a
                        className={[
                          styles.dropdownBtn,
                          router.pathname.split("/")[2] === "coordinator"
                            ? styles.active
                            : "",
                        ].join(" ")}
                      >
                        <div className="m-0 p-0">Cordinator</div>
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/signup/supervisor">
                      <a
                        className={[
                          styles.dropdownBtn,
                          router.pathname.split("/")[2] === "supervisor"
                            ? styles.active
                            : "",
                        ].join(" ")}
                      >
                        <div className="m-0 p-0">Supervisor</div>
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/eligible">
                      <a
                        className={[
                          styles.dropdownBtn,
                          router.pathname.split("/")[2] === "student"
                            ? styles.active
                            : "",
                        ].join(" ")}
                      >
                        <div className="m-0 p-0">Student</div>
                      </a>
                    </Link>
                  </li>
                </ul>
              </CSSTransition>
            </button>
          </div>

          <Link href="/about">
            <a
              className={[
                styles.nav_li,
                router.pathname === "/about" ? styles.active : "",
              ].join(" ")}
            >
              About
            </a>
          </Link>
        </>
      ) : (
        <>
          {role === "Student" && (
            <Link href="/logbook">
              <a
                className={[
                  styles.nav_li,
                  router.pathname === "/logbook" ? styles.active : "",
                ].join(" ")}
              >
                <div className="w-full flex items-center">
                  <RiBook2Fill />
                  <span className="pl-1">Logbook</span>
                </div>
              </a>
            </Link>
          )}

          {role !== "Admin" && (
            <Link href="/chats">
              <a
                className={[
                  styles.nav_li,
                  router.pathname === "/chats" ? styles.active : "",
                ].join(" ")}
              >
                <div className="w-full flex items-center">
                  <RiChat3Fill />
                  <span className="pl-1">Chat</span>
                </div>
              </a>
            </Link>
          )}

          {role !== "Student" && role !== 'Admin' && (
            <Link href="/activities">
              <a
                className={[
                  styles.nav_li,
                  router.pathname === "/activities" ? styles.active : "",
                ].join(" ")}
              >
                <div className="w-full flex items-center">
                  <TbActivityHeartbeat />
                  <span className="pl-1">Activities</span>
                </div>
              </a>
            </Link>
          )}

          {role === "Student" && (
            <Link href="/student/activities">
              <a
                className={[
                  styles.nav_li,
                  router.pathname === "/student/activities"
                    ? styles.active
                    : "",
                ].join(" ")}
              >
                <div className="w-full flex items-center">
                  <TbActivityHeartbeat />
                  <span className="pl-1">Activities</span>
                </div>
              </a>
            </Link>
          )}

          {role === "Coordinator" && (
            <Link href="/eligibility">
              <a
                className={[
                  styles.nav_li,
                  router.pathname === "/eligibility" ? styles.active : "",
                ].join(" ")}
              >
                <div className="w-full flex items-center">
                  <BiCheckShield />
                  <span className="pl-1">Eligible</span>
                </div>
              </a>
            </Link>
          )}

          {role !== "Admin" && (
            <Link href={`/profile/${role?.toLowerCase()}`}>
              <a
                className={[
                  styles.nav_li,
                  router.pathname === `/profile/${role?.toLowerCase()}` ||
                  router.pathname === "/profile/change-password" ||
                  router.pathname === "/profile/delete-account"
                    ? styles.active
                    : "",
                ].join(" ")}
              >
                <div className="w-full flex items-center">
                  <RiUserSettingsLine />
                  <span className="pl-1">Profile</span>
                </div>
              </a>
            </Link>
          )}

          <a className={styles.nav_li}>
            <button
              onClick={() =>
                setDropDown((prev) => ({
                  user: prev.user,
                  profile: !prev.profile,
                  chat: prev.chat,
                }))
              }
              className={styles.dropdownBtn}
            >
              <div className="w-full">
                <img
                  src={
                    avatar === defaultImg ||
                    cloudinary === "cloudinary" ||
                    role === "Admin"
                      ? avatar
                      : `${beHost}${avatar}` || "../images/thumbnail.png"
                  }
                  className={styles.displayPic}
                />
                <span className="pl-2">{name}</span> <FaCaretDown />
              </div>
              <CSSTransition
                nodeRef={nodeRefLogout}
                mountOnEnter
                unmountOnExit
                in={dropDown.profile}
                timeout={400}
                classNames={{
                  enterActive: animate.signupEnterActive,
                  exitActive: animate.signupExitActive,
                }}
              >
                <ul ref={nodeRefLogout} className={styles.dropdown_content}>
                  <li>
                    <Link href="/">
                      <span
                        className={[
                          styles.dropdownBtn,
                          router.pathname.split("/")[2] === "cordinator"
                            ? styles.active
                            : "",
                        ].join(" ")}
                      >
                        <div className="p-0 m-0" onClick={logout}>
                          <FaPowerOff /> <span className="pl-1">Logout</span>{" "}
                        </div>
                      </span>
                    </Link>
                  </li>
                </ul>
              </CSSTransition>
            </button>
          </a>
        </>
      )}
    </div>
  );
};

export default Links;
