'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    // this below function decides which fields needs to show to user each time when we return a user in api response
    toJSON(){
      //overriding here
      return {...this.get(), id: undefined }
    }
  }
  student.init({
    s_id : {
        type : DataTypes.INTEGER,
        allowNull : false
    },
    s_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    s_email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    s_password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otpExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    sequelize,
    tableName: 'student',
    modelName: 'student',
  });
  return student;
}; 