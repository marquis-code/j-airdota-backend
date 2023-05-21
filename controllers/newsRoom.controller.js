const NewsRoom = require("../models/newsRoom.model");
const mongoose = require("mongoose");

module.exports.handle_new_newsRoom = async (req, res) => {
  try {
    const newsRoom = await NewsRoom.findOne({
      title: req.body.title,
    });
    if (newsRoom) {
      return res.status(404).json({ errorMessage: "NewsRoom Already exist." });
    }

    const newNewsRoom = new NewsRoom({
      title: req.body.title,
      subTitle: req.body.subTitle,
      content: req.body.content,
      noteFromPublisher: req.body.noteFromPublisher,
      date: req.body.date,
      newsRoomType: req.body.newsRoomType,
    });

    newNewsRoom
      .save()
      .then(() => {
        return res
          .status(200)
          .json({ successMessage: "News room was successfully created" });
      })
      .catch(() => {
        return res.status(500).json({
          errorMessage:
            "Something went wrong while saving news room. Please try again later",
        });
      });
  } catch (error) {
    return res.status(500).json({
      errorMessage: "Something went wrong. Please try again later",
    });
  }
};

module.exports.get_all_newsRooms = async (req, res) => {
  try {
    const newsRooms = await NewsRoom.find();
    if (!newsRooms) {
      return res
        .status(500)
        .json({ errorMessage: "News room not available" });
    }
    return res.status(200).json(newsRooms);
  } catch (error) {
    return res.status(500).json({
      errorMessage:
        "Something went wrong while fetching news rooms. Please try again later",
    });
  }
};
module.exports.get_one_newsRoom = async (req, res) => {
  const _id = req.params.id;
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ errorMessage: "Invalid news room ID" });
  }
  try {
    const newsRoom = await NewsRoom.findById(_id);
    if (!newsRoom) {
      return res
        .status(404)
        .json({ errorMessage: "News Room does not exist" });
    }
    return res.status(200).json(newsRoom);
  } catch (error) {
    return res
      .status(500)
      .json({ errorMessage: "Something went wrong. Please try again later." });
  }
};

module.exports.delete_newsRoom = async (req, res) => {
  const _id = req.params.id;
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ errorMessage: "Invalid news room ID" });
  }
  try {
    let newsRoom = await NewsRoom.findById(_id);
    await newsRoom.remove();
    return res.status(200).json({
      successMessage: "News room was successfully removed",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ errorMessage: "Something went wrong. Please try again." });
  }
};
