const Publication = require("../models/publication.model");
const cloudinary = require("../utils/cloudinary");
const mongoose = require("mongoose");

module.exports.handle_new_publication = async (req, res) => {
    try {
        if (!req.file) {
            return res
                .status(400)
                .json({ errorMessage: "Please upload publication image" });
        }

        const publication = await Publication.findOne({
            publicationTitle: req.body.publicationTitle,
        });
        if (publication) {
            return res.status(404).json({ errorMessage: "publication already exist" });
        }

        const upload_response = await cloudinary.uploader.upload(req.file.path);

        if (upload_response) {
            const newPublication = new Publication({
                publicationTitle: req.body.publicationTitle,
                publicationSubTitle: req.body.publicationSubTitle,
                publicationPrice: req.body.publicationPrice,
                author: req.body.author,
                available: req.body.available,
                language: req.body.language,
                published_date: req.body.published_date,
                publicationUrl: upload_response.secure_url,
                cloudinary_id: upload_response.public_id,
            });

            newPublication
                .save()
                .then(() => {
                    return res
                        .status(200)
                        .json({ successMessage: "Publication saved successfully" });
                })
                .catch((error) => {
                    return res.status(500).json({
                        errorMessage:
                            "Something went wrong while saving publication. Please try again later",
                    });
                });
        }
    } catch (error) {
        return res.status(500).json({
            errorMessage: "Something went wrong. Please try again later",
        });
    }
};

module.exports.get_all_publications = async (req, res) => {
    try {
        const publications = await Publication.find();
        if (!publications) {
            return res.status(500).json({ errorMessage: "publication not available" });
        }
        return res.status(200).json(publications);
    } catch (error) {
        return res.status(500).json({
            errorMessage:
                "Something went wrong while fetching publications. Please try again later",
        });
    }
};

module.exports.get_one_publication = async (req, res) => {
    const _id = req.params.id;
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ errorMessage: "Invalid publication ID" });
    }
    try {
        const publication = await Publication.findById(_id);
        if (!publication) {
            return res.status(404).json({ errorMessage: "Publication does not exist" });
        }
        return res.status(200).json(publication);
    } catch (error) {
        return res
            .status(500)
            .json({ errorMessage: "Something went wrong. Please try again later." });
    }
};


module.exports.update_publication = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ errorMessage: "Invalid publication ID" });
    }
    try {
        let publication = await Publication.findById(req.params.id);
        await cloudinary.uploader.destroy(publication.cloudinary_id);

        let result;

        if (req.file) {
            result = await cloudinary.uploader.upload(req.file.path);
        }

        const data = {
            publicationTitle: req.body.publicationTitle || publication.publicationTitle,
            publicationSubTitle:
                req.body.publicationSubTitle || publication.publicationSubTitle,
            author: req.body.author || publication.author,
            publicationPrice: req.body.publicationPrice || publication.publicationPrice,
            available: req.body.available || publication.available,
            language: req.body.language || publication.language,
            published_date: req.body.published_date || publication.published_date,
            publicationUrl: result?.secure_url || publication.publicationUrl,
            cloudinary_id: result?.public_id || publication.cloudinary_id,
        };

        publication = await Publication.findByIdAndUpdate(req.params.id, data, {
            new: true,
        });

        if (!publication) {
            return res.status(404).json({ errorMessage: "Publication not found" });
        }

        return res.status(200).json({
            successMessage: "publication was successfully updated",
        });
    } catch (error) {
        return res.status(500).json({ errorMessage: "Something went wrong" });
    }
};



module.exports.delete_publication = async (req, res) => {
    const _id = req.params.id;
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ errorMessage: "Invalid publication ID" });
    }
    try {
        let publication = await Publication.findById(_id);
        await cloudinary.uploader.destroy(publication.cloudinary_id);
        await Publication.remove();
        return res.status(200).json({
            successMessage: "publication was successfully removed",
        });
    } catch (error) {
        return res
            .status(500)
            .json({ errorMessage: "Something went wrong. Please try again." });
    }
};
