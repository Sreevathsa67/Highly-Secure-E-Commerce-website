const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	userName: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		enum: ["user", "admin"], // This limits role to either "user" or "admin"
		default: "admin",
	},
});

UserSchema.methods.isAdmin = function () {
	return this.role === "admin";
};

const User = mongoose.model("User", UserSchema);
module.exports = User;


