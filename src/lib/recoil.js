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

export const dataKamusState = atom({
  key: "dataKamusState",
  default: {},
});
export const searchKamusAtom = atom({
  key: "searchKamusAtom",
  default: "",
});

// pagination
export const abjadState = atom({
  key: "abjadState",
  default: "a",
});
export const pageState = atom({
  key: "pageState",
  default: 1,
});

export const isLoadKamusState = atom({
  key: "isLoadKamusState",
  default: true,
});

export const editingItemState = atom({
  key: "editingItemState",
  default: null,
});
