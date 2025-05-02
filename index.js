import sv from "./src/sv.js";

const UserSchema = sv.Schema({
  username: sv
    .require()
    .min(8)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/),
  password: sv.require().min(8).string(),
  email: sv.require().email(),
});

const data = {
  username: "",
  password: "",
  email: "",
};

console.log(UserSchema.validate(data));
