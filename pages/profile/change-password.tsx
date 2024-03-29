import ChangePassword from "../../components/admin/ChangePassword";
import { useAppSelector } from "../../hooks/store.hook";
import styles from "../../styles/Profile.module.scss";
import { Navbar } from "../../components/NavBar";
import { useRouter } from "next/router";
import Head from "next/head";
import Login from "../login";
import React from "react";

const ChangeUserPassword = () => {
  const isAuth = useAppSelector((state) => state.auth?.isAuth);
  const router = useRouter();

  if (!isAuth) {
    router.replace("/login");
    return <Login />;
  }

  return (
    <>
      <Head>
        <title>Change Password</title>
      </Head>
      <header>
        <Navbar />
      </header>
      <main>
        <ChangePassword style={styles.profiles} user="student" />
      </main>
    </>
  );
};

export default ChangeUserPassword;
