const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        phone: {
            type: Number,
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
        accepted: {
            type: Boolean,
            required: true,
        },
        typewallet: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        wallet: {
            type: Number,
            required: true,
            default: 10000
        },
        useractived: {
            type: Boolean,
            required: true,
        },
        realwallet: {
            type: Boolean,
            required: true,
        },
        enterConditional: {
            type: Boolean,
            required: true,
        },
        role: {
            type: String,
            required: true,
        },
        followers: {
            type: Number,
            required: true,
        },
        bonusClaimed: {
            type: Boolean,
            default: false, 
        }
        
    },
    { 
        id: false,
        timestamps: true,
    }
)

userSchema.virtual("level").get(function () {
  if (this.wallet < 50000) return 1;
  if (this.wallet < 100000) return 2;
  if (this.wallet < 500000) return 3;
  if (this.wallet < 1000000) return 4;
  return 5;
});

userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("User", userSchema)