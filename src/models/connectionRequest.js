const mongoose = require("mongoose");
const { Schema } = mongoose;

const connectionRequestSchema = new Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",  //providing reference to User collection
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["interested", "ignored", "accepted", "rejected"], //want to restrict users only to these status , apart from it if there is any other status , it will throw error
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function (next) {
  //this acts as a middleware , it will be called before any document is getting saved in "ConnectionRequest" collection
  // console.log("pre hook called!");
  //   console.log(this.fromUserId, this.toUserId);
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("You can't send request to yourself");
  }
  next();
});

const ConnectionRequestModel = mongoose.model(
  "connectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
