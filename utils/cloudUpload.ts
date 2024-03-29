import generateUniqueFilename from "./genfilename.utils";
import { ICloud } from "../interfaces/cloud.interfaces";
import constants from "../config/constant.config";
import uploadPreset from "./uploadpreset.utils";
import axios from "axios";

const { cloudEndPoint, cloudName } = constants;

export const uploadToCloudinary = ({ file, type }: ICloud): Promise<string> => {
  return new Promise<string>(async (resolve, reject) => {
    try {

      if (!file) {
        reject({
          status: 100,
          msg: "File not uploaded!",
        });
        return;
      }

      const { type: t, size } = file;

      if (t !== "image/png" && t !== "image/jpg" && t !== "image/jpeg") {
        reject({
          status: 101,
          msg: "Invalid File. File must be either png, jpg or jpeg!",
        });
        return;
      }

      if (size > 100000) {
        console.log(file.type);
        reject({ status: 102, msg: "Maximum file size is 100KB!" });
        return;
      }

      // Rename Filename and Upload to Cloudinary
      const newFileName = generateUniqueFilename({ type });
      const newFile = new File([file], newFileName, { type: file.type });
      const preset = uploadPreset({ type });

      const data = new FormData();
      data.append("file", newFile);
      data.append("upload_preset", preset);
      data.append("cloud_name", cloudName);

      const endpoint = `${cloudEndPoint}${cloudName}/image/upload`;

      const res = await axios.post(endpoint, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      resolve(res.data?.url);
    } catch (err) {
      return reject(err);
    }
  });
};
