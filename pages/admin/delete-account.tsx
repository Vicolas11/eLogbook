import DeleteAccount from "../../components/admin/DeleteAccount";
import DashSideBar from "../../components/DashSideBar";
import styles from "../../styles/Profile.module.scss";
import DashHeader from "../../components/DashHeader";
import Head from "next/head";
import React from "react";

const DeleteUserAccount = () => {
  return (
    <>
      <Head>
        <title>Delete Account</title>
      </Head>
      <main>
        <DashHeader title="Account Settings" />
        <DashSideBar />
        <DeleteAccount style={styles.profile} user="admin" />
      </main>
    </>
  );
};

export default DeleteUserAccount;