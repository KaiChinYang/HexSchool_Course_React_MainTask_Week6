export const emailValidation = {
  required: "請輸入信箱",
  pattern: {
    value: /^\S+@\S+$/i,
    message: "Email 格式不正確",
  },
};