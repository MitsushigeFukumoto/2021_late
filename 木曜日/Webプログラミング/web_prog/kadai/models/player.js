'use strict';
module.exports = (sequelize, DataTypes) => {
  const Player = sequelize.define('Player', {
    userId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "利用者は必須です。"
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "選手名は必須です。"
        }
      }
    },
    age: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "年齢は必須です。"
        }
      }
    },
    position: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "ポジションは必須です。"
        }
      }
    },
    hometown: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "出身地は必須です。"
        }
      }
    }
  }, {});
  Player.associate = function(models) {
    Player.belongsTo(models.User);
  };
  return Player;
};
