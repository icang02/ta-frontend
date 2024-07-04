import { atom } from "recoil";

export const resultApiState = atom({
  key: "resultApiState",
  default: [],
});

export const saranKataState = atom({
  key: "saranKataState",
  default: [],
});

export const loadingUploadState = atom({
  key: "loadingUploadState",
  default: false,
});

export const jumlahKataValidState = atom({
  key: "jumlahKataValidState",
  default: null,
});

export const fileNameState = atom({
  key: "fileName",
  default: null,
});

