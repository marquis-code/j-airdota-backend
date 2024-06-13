const Event = require("../models/events.models.js");
const cloudinary = require("../utils/cloudinary");
const mongoose = require("mongoose");

module.exports.handle_new_event = async (req, res) => {
    try {
        if (!req.file) {
            return res
                .status(400)
                .json({ errorMessage: "Please upload event image" });
        }

        const event = await Event.findOne({
            programTitle: req.body.programTitle,
        });
        if (event) {
            return res.status(404).json({ errorMessage: "Event already exist" });
        }

        const upload_response = await cloudinary.uploader.upload(req.file.path);

        if (upload_response) {
            const newProgram = new Event({
                programTitle: req.body.programTitle,
                programDescription: req.body.programDescription,
                programDate: req.body.programDate,
                programRecordingUrl: req.body.programRecordingUrl,
                programImageUrl: upload_response.url,
                cloudinary_id: upload_response.public_id,
            });

            newProgram
                .save()
                .then(() => {
                    return res
                        .status(200)
                        .json({ successMessage: "Event was saved successfully" });
                })
                .catch((error) => {
                    return res.status(500).json({
                        errorMessage:
                            "Something went wrong while saving event. Please try again later",
                    });
                });
        }
    } catch (error) {
        return res.status(500).json({
            errorMessage: "Something went wrong. Please try again later",
        });
    }
};

module.exports.get_all_events = async (req, res) => {
    try {
        const events = await Event.find();
        if (!events) {
            return res.status(500).json({ errorMessage: "Event not available" });
        }
        return res.status(200).json(events);
    } catch (error) {
        return res.status(500).json({
            errorMessage:
                "Something went wrong while fetching events. Please try again later",
        });
    }
};

module.exports.get_one_event = async (req, res) => {
    const _id = req.params.id;
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ errorMessage: "Invalid event ID" });
    }
    try {
        const event = await Event.findById(_id);
        if (!event) {
            return res.status(404).json({ errorMessage: "Event does not exist" });
        }
        return res.status(200).json(event);
    } catch (error) {
        return res
            .status(500)
            .json({ errorMessage: "Something went wrong. Please try again later." });
    }
};


module.exports.update_event = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ errorMessage: "Invalid event ID" });
    }
    try {
        let event = await Event.findById(req.params.id);
        await cloudinary.uploader.destroy(event.cloudinary_id);

        let result;

        if (req.file) {
            result = await cloudinary.uploader.upload(req.file.path);
        }

        const data = {
            programTitle: req.body.programTitle || event.programTitle,
            programDescription: req.body.programDescription || event.programDescription,
            programDate: req.body.programDate || event.programDate,
            programRecordingUrl: req.body.programRecordingUrl || event.programRecordingUrl,
            programImageUrl: result?.secure_url || event.programImageUrl,
            cloudinary_id: result?.public_id || event.cloudinary_id,
        };

        event = await Event.findByIdAndUpdate(req.params.id, data, {
            new: true,
        });

        if (!event) {
            return res.status(404).json({ errorMessage: "Event not found" });
        }

        return res.status(200).json({
            successMessage: "Event was successfully updated",
        });
    } catch (error) {
        return res.status(500).json({ errorMessage: "Something went wrong" });
    }
};

module.exports.delete_event = async (req, res) => {
    const _id = req.params.id;
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ errorMessage: "Invalid event ID" });
    }
    try {
        let event = await Event.findById(_id);
        await cloudinary.uploader.destroy(event.cloudinary_id);
        await event.remove();
        return res.status(200).json({
            successMessage: "Event was successfully removed",
        });
    } catch (error) {
        return res
            .status(500)
            .json({ errorMessage: "Something went wrong. Please try again." });
    }
};