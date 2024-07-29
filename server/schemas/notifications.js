/* eslint-disable no-unused-vars */
import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const notifSchema = new Schema(
    {
        team: [{type: Schema.Types.ObjectId, ref: "User"}],
        text: {type: String},
        task: {type: Schema.Types.ObjectId, ref: "Task"},
        notiType: {type: String, default: "alert", enum: ["alert","message"]},
        isRead: [{type: Schema.Types.ObjectId, ref: "User"}],
    },
    {
        timestamps: true
    }
);

const Notif = mongoose.model("Notification",notifSchema);

export default Notif;
