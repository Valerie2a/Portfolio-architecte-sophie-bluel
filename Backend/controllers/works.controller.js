const db = require('./../models');
const Works = db.works;

// Détecte si on est en local ou en production
const baseUrl =
  process.env.BASE_URL || `http://localhost:${process.env.PORT || 5678}`;

exports.findAll = async (req, res) => {
  const works = await Works.findAll({include: 'category'});
  return res.status(200).json(works);
};

exports.create = async (req, res) => {
  const title = req.body.title;
  const categoryId = req.body.category;
  const userId = req.auth.userId;
  const imageUrl = `${baseUrl}/images/${req.file.filename}`;

  console.log('Received data:', {
    title,
    categoryId,
    userId,
    imageUrl,
  });

  try {
    const work = await Works.create({
      title,
      imageUrl,
      categoryId,
      userId,
    });
    return res.status(201).json(work);
  } catch (err) {
    console.error('Error creating work:', err);
    return res.status(500).json({error: err.message || 'Something went wrong'});
  }
};
exports.delete = async (req, res) => {
  try {
    await Works.destroy({where: {id: req.params.id}});
    return res.status(204).json({message: 'Work Deleted Successfully'});
  } catch (e) {
    return res.status(500).json({error: new Error('Something went wrong')});
  }
};
