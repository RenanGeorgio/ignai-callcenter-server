import mongoose from "../../database";

const { Schema } = mongoose;

const menuSchema = new Schema({
  company: {
    type : String,
    required : true 
  },
  phoneNumber: {
    type: String,
    required: true
  },
  menuList: [
    {
      menuItem: {
        type: String
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }, 
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Menu = mongoose.model('Menu', menuSchema);

export default Menu;