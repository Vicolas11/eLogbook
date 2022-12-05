import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import styles from "../styles/Profile.module.scss";
import { customStyles, DEFAULT_IMG } from "../utils/util";
import ManageProfile from "./ManageProfile";
import "react-phone-number-input/style.css";
import Select from "react-select";
import { useState } from "react";
import { IAuthSupSlice } from "../interfaces/slice.interface";
import { useAppDispatch, useAppSelector } from "../hooks/store.hook";
import { UPDATE_COORD } from "../graphql/mutations/coordinator";
import { errorToastStyle, successToastStyle } from "../utils/styles.utils";
import toast, { Toaster } from "react-hot-toast";
import { setCoordAuth, setRest } from "../store/slice/auth.slice";
import { useApolloClient, useMutation } from "@apollo/client";
import router from "next/router";
import { staffTitle } from "../utils/title.utils";
import { gender } from "../utils/gender";
import { IFileType, IUploadFile } from "../interfaces/upload.interface";
import axios from "axios";
import constants from "../config/constant.config";
import Loader from "./Loader";
import { client } from "../graphql/apolloClient";

const ProfileCoordinator = () => {
  const data: IAuthSupSlice = useAppSelector(
    (state) => state.auth.userCoordData
  );
  const token = useAppSelector((state) => state.auth.token);

  const [textInput, setTextInput] = useState({
    name: {
      firstName: `${data?.firstName}`,
      lastName: `${data?.lastName}`,
      title: `${data?.title}`,
    },
    email: `${data?.email}`,
    phone: `${data?.phone}`,
    gender: `${data?.gender}`,
    institute: `${data?.institute}`,
    dept: `${data?.department}`,
    staffId: `${data?.staffID}`,
  });

  const [selectedFile, setSelectedFile] = useState({
    file: null,
    isUploaded: false,
    img: null,
  });

  type OptionType = { label: string; value: string }[];

  const optionsTitle: OptionType = staffTitle;

  const optionsGender: OptionType = gender;

  const dispatch = useAppDispatch();

  const logout = async () => {
    // Reset Apollo Cache
    client.resetStore();
    dispatch(setRest());
    router.push("/login");
  };

  const [updateCoord, { loading, reset }] = useMutation(UPDATE_COORD, {
    onCompleted: (data) => {
      toast.success(data.updateCoordinator?.message, successToastStyle);
      console.log("DATA PROFILE ==> ", data);
      dispatch(setCoordAuth(data?.updateCoordinator));
      reset();
      resetImage();
    },
    onError: ({ graphQLErrors, networkError }) => {
      try {
        if (graphQLErrors)
          graphQLErrors.forEach(({ message, locations, path }) => {
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            );
            const tokenErr = message.split(":")[0];
            toast.error(`${message}`, errorToastStyle);
            if (tokenErr === "TokenExpiredError") {
              logout();
            }
          });
        if (networkError) {
          toast.error(`${networkError}`, errorToastStyle);
          console.log(`[Network error]: ${networkError}`);
        }
      } catch (err) {
        console.log("ERR****", err);
      }
    },
  });

  const selectTitle = (option: OptionType | null | any) => {
    if (option) {
      setTextInput((prev) => ({
        name: {
          firstName: prev.name.firstName,
          lastName: prev.name.lastName,
          title: option.value,
        },
        email: prev.email,
        phone: prev.phone,
        institute: prev.institute,
        gender: prev.gender,
        dept: prev.dept,
        staffId: prev.staffId,
      }));
    }
  };

  const onChangeFirstName = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setTextInput((prev) => ({
      name: {
        firstName: evt.target.value,
        lastName: prev.name.lastName,
        title: prev.name.title,
      },
      email: prev.email,
      phone: prev.phone,
      gender: prev.gender,
      institute: prev.institute,
      dept: prev.dept,
      staffId: prev.staffId,
    }));
  };

  const onChangeLastName = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setTextInput((prev) => ({
      name: {
        firstName: prev.name.firstName,
        lastName: evt.target.value,
        title: prev.name.title,
      },
      email: prev.email,
      phone: prev.phone,
      gender: prev.gender,
      institute: prev.institute,
      dept: prev.dept,
      staffId: prev.staffId,
    }));
  };

  const onChangePhone = (value: string | undefined) => {
    setTextInput((prev) => ({
      name: {
        firstName: prev.name.firstName,
        lastName: prev.name.lastName,
        title: prev.name.title,
      },
      email: prev.email,
      phone: value,
      gender: prev.gender,
      institute: prev.institute,
      dept: prev.dept,
      staffId: prev.staffId,
    }));
  };

  const selectGender = (option: OptionType | null | any) => {
    if (option) {
      setTextInput((prev) => ({
        name: {
          firstName: prev.name.firstName,
          lastName: prev.name.lastName,
          title: prev.name.title,
        },
        email: prev.email,
        phone: prev.phone,
        institute: prev.institute,
        gender: option.value,
        dept: prev.dept,
        staffId: prev.staffId,
      }));
    }
  };

  const onFileUpload = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const mainFile = evt.target.files;
    // console.log(mainFile[0]);
    setSelectedFile({
      file: mainFile[0],
      isUploaded: true,
      img: URL.createObjectURL(mainFile[0]),
    });
  };

  const resetImage = () => {
    setSelectedFile((prev) => ({
      file: null,
      isUploaded: false,
      img: null,
    }));
  };

  const onSubmitHandler = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (selectedFile.file) {
      const formData = new FormData();
      const query = `mutation($updateInput: FileUpdateInput!) { updateFile(updateInput: $updateInput) { message imageUrl status } }`;

      const fileInput: IFileType = {
        id: `${data?.id}`,
        type: "avatar",
        file: null,
      };

      const map = { "0": ["variables.updateInput.file"] };
      const operations = JSON.stringify({
        query,
        variables: { updateInput: fileInput },
      });
      formData.append("operations", operations);
      formData.append("map", JSON.stringify(map));
      formData.append("0", selectedFile.file);

      // console.log("formData === ", constants.graphqlBaseUrl);
      await axios
        .post(constants.graphqlBaseUrl, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "apollo-require-preflight": true,
          },
        })
        .then((response) => {
          const status = response.status;
          console.log("RESPONSESS ===", response);
          if (response?.data?.errors) {
            const errMsg = response?.data?.errors;
            toast.error(errMsg[0].message, errorToastStyle);
            const tokenErr = errMsg[0].message.split(":")[0];
            if (tokenErr === "TokenExpiredError") {
              logout();
            }
            return;
          }
          const { updateFile } = response?.data?.data;
          console.log("DATES ===", updateFile);
          const { imageUrl } = updateFile as IUploadFile;
          console.log("IMAGEURL ===", imageUrl);

          if (status === 200) {
            updateCoord({
              variables: {
                updateInput: {
                  title: textInput.name.title,
                  firstName: textInput.name.firstName,
                  lastName: textInput.name.lastName,
                  gender: textInput.gender,
                  email: textInput.email,
                  phone: textInput.phone,
                  avatar: imageUrl,
                },
              },
            });
          }
        })
        .catch((error) => {
          console.log("ERROR ====", error);
          toast.error(
            "An error occurred while uploading image",
            errorToastStyle
          );
        });
    } else {
      updateCoord({
        variables: {
          updateInput: {
            title: textInput.name.title,
            firstName: textInput.name.firstName,
            lastName: textInput.name.lastName,
            gender: textInput.gender,
            email: textInput.email,
            phone: textInput.phone,
          },
        },
      });
    }
  };

  return (
    <div className={styles.profiles}>
      <Toaster position="top-center" reverseOrder={false} />
      {loading && <Loader show={true} />}
      <ManageProfile
        profile={`/profile/${data?.user.toLowerCase()}`}
        change="/profile/change-password"
        delete="/profile/delete-account"
      />
      <div className={styles.userProfile}>
        <h1>User Profile</h1>
        <div className={styles.userImg}>
          <img
            src={
              selectedFile.img
                ? selectedFile.img
                : data?.avatar === DEFAULT_IMG ? data?.avatar : `${constants.beHost}${data?.avatar}` || "../images/thumbnail.png"
            }
            alt="passport"
          />
          <div>
            <h1>{`${data?.title}. ${data?.firstName} ${data?.lastName}`}</h1>
            <h2>{`${data?.email}`}</h2>
            <div className="flex items-center justify-between my-3">
              <div
                className={[
                  styles.uploadAvatarBtn,
                  selectedFile.isUploaded ? styles.fileUpload : "",
                ].join(" ")}
              >
                <label>
                  <input
                    type="file"
                    name="avatar"
                    id="avatar"
                    accept="image/png, image/jpg, image/jpeg"
                    onChange={onFileUpload}
                  />
                  {selectedFile.isUploaded ? "File Uploaded" : "Change Image"}
                </label>
              </div>
              <button
                className={
                  selectedFile.isUploaded
                    ? "bg-red-700 rounded-lg px-3 py-1 text-sm"
                    : styles.uploadAvatarBtn
                }
                onClick={resetImage}
              >
                Reset Image
              </button>
            </div>
          </div>
        </div>

        <form className="mt-4" onSubmit={onSubmitHandler}>
          <div className="flex flex-col md:flex-row justify-between mb-4 w-full">
            <div className="w-full md:w-9/12 md:mr-2">
              <Select
                options={optionsTitle}
                defaultValue={{
                  value: `${data?.title}`,
                  label: `${data?.title}`,
                }}
                className={styles.select}
                placeholder="Title"
                onChange={selectTitle}
                styles={customStyles}
              />
            </div>
            <div className="w-full md:mr-1 mt-3 md:mt-0">
              <input
                required
                placeholder="First Name"
                name="firstName"
                type="text"
                className={styles.inputStyle}
                value={textInput.name.firstName}
                onChange={onChangeFirstName}
              />
            </div>
            <div className="w-full md:ml-1 mt-3 md:mt-0">
              <input
                required
                placeholder="Last Name"
                name="lastName"
                type="text"
                className={styles.inputStyle}
                value={textInput.name.lastName}
                onChange={onChangeLastName}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mb-4 w-full">
            <div className="w-full mr-1">
              <input
                required
                placeholder="Staff ID"
                name="staffId"
                type="text"
                className={styles.inputStyle}
                value={textInput.staffId}
                readOnly
              />
            </div>
            <div className="w-full md:ml-1 mt-3 md:mt-0">
              <PhoneInput
                international
                countryCallingCodeEditable={false}
                placeholder="Phone Number"
                className={styles.phoneInput}
                defaultCountry="NG"
                value={textInput.phone}
                onChange={onChangePhone}
                error={
                  textInput.phone
                    ? isValidPhoneNumber(textInput.phone)
                      ? undefined
                      : "Invalid phone number"
                    : "Phone number required"
                }
              />
            </div>
          </div>

          <div className="flex flex-col space-x-0 space-y-2 md:space-y-0 md:space-x-3 md:flex-row justify-between items-center mb-4 w-full">
            <div className="w-full">
              <input
                required
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                className={styles.inputStyle}
                value={textInput.email}
                readOnly
              />
            </div>
            <div className="w-full">
              <Select
                options={optionsGender}
                defaultValue={{
                  value: `${data?.gender}`,
                  label: `${data?.gender}`,
                }}
                className={styles.select}
                placeholder="Gender"
                onChange={selectGender}
                styles={customStyles}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between mb-4 w-full">
            <div className="w-full md:mr-1 mr-0">
              <input
                required
                placeholder="Department"
                name="dept"
                id="dept"
                type="text"
                className={styles.inputStyle}
                value={textInput.dept}
                readOnly
              />
            </div>
            <div className="w-full md:ml-1 mt-3 md:mt-0">
              <input
                required
                placeholder="Institution"
                name="institution"
                id="institution"
                type="text"
                className={styles.inputStyle}
                value={textInput.institute}
                readOnly
              />
            </div>
          </div>

          <div className="flex justify-center p-0 mb-4">
            <button className={styles.saveBtn} type="submit">
              <span className="flex justify-center items-center">
                Save Changes
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileCoordinator;
