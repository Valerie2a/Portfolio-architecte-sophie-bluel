module.exports = (sequelize, DataTypes) => {
  const Works = sequelize.define(
    'works',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        // Ajout de userId
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {timestamps: false}
  );
  return Works;
};
