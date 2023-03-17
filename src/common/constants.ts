export const DET_MEAN = 0.785;
export const DET_STD = 0.275;

export const DET_CONFIG = {

  db_resnet50:{
    value: "db_resnet50",
    label: "DB (RESNET)",
    height: 512,
    width: 512,
    path: "/models/converted/model.json",
  }
};

// Recognition cfg

export const REC_MEAN = 0.694;
export const REC_STD = 0.298;

export const RECO_CONFIG = {
  crnn_vgg16: {
    value: "crnn_vgg16",
    label: "CRNN (VGG)",
    height: 32,
    width: 128,
    path: "/models/crnn_vgg16/model.json",
  },
};

export const VOCAB =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~°£€¥¢฿àâéèêëîïôùûüçÀÂÉÈÊËÎÏÔÙÛÜÇ";
