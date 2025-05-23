'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.hasMany(models.StudentForm, {
      foreignKey: 'studentId',
      as: 'studentForms'
});

    }
    // this below function decides which fields needs to show to user each time when we return a user in api response
    toJSON(){
      //overriding here
      return {...this.get(), id: undefined }
    }
  }
  user.init({
    uuid:{
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cnic:{
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    role:{
      type: DataTypes.STRING,
      allowNull: false
    },
    isVerified:{
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otpExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    regno: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneno: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    
  }, {
    sequelize,
    tableName: 'users',
    modelName: 'user',
  });
  return user;
}; 