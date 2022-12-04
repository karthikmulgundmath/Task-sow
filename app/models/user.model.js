module.exports = (mongoose) => {
  var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

  var schema = mongoose.Schema(
    {
      full_name: String,
      permanent_address: String,
      city: String,
      pincode: Number,
      email: String,
      mobile_number: String,
      createdBy: ObjectId,
      updatedBy: ObjectId,
      dob: String,
      mpin: String,
      isActive: {
        type: Boolean,
        default: true,
      },
      token: String,
      isAdmin: {
        type: Boolean,
        default: false,
      },
      isSuperAdmin: {
        type: Boolean,
        default: false,
      },
      isMerchant: {
        type: Boolean,
        default: false,
      },
      password: {
        type: String,
        require: true,
      },
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, mobile_number, ...object } = this.toObject();
    object.mobile_number = mobile_number;
    return object;
  });

  const User = mongoose.model("user", schema);
  return User;
};
