/* eslint-disable no-unused-vars */
  /* eslint-disable no-undef */
  import mongoose from "mongoose";
  import bcrypt from "bcryptjs";
  import { Schema } from "mongoose";

  const userSchema = new Schema({
      name: { type:String , required: true },
      email: { type:String , required: true, unique: true },
      role: { type:String , required: true, default: "Admin" },
      password: { type:String , required: true },
      isAdmin: { type:Boolean , required: true, default:true },
      isActive: { type:Boolean , required: true, default:true },
    },
    {
      timestamps : true
    }
  );

//   userSchema.pre("save", async function (next) {
//       if(!this.isModified("password")){
//           next();
//       }
//       const salt = await bcrypt.genSalt(10)
//       this.password = await bcrypt.hash(this.password, salt);
//   });

//   userSchema.methods.reset = async function (enteredPassword) {
//     const salt = await bcrypt.genSalt(10)
//     return await bcrypt.hash(enteredPassword, salt);
// };

  userSchema.methods.matchPassword = async function(enteredPassword){
      //return await bcrypt.compare(enteredPassword, this.password);
      return await enteredPassword === this.password;
  }


  const User = mongoose.model("User", userSchema);

  export default User;