import express from 'express';
import { unlink } from 'fs';
import * as dbPictures from '../db/db_pictures.js';

const router = express.Router();

// remove an image from the database and file system that matches the descriptions
router.post('/delete_image', express.json(), async (req, res) => {
  const { pictureName } = req.body;
  const { listingID } = req.body;
  const [dbResponse] = await dbPictures.deletePicture(listingID, pictureName);
  if (dbResponse.affectedRows) {
    unlink(`./public/Pictures/${pictureName}`, () => {
      console.log(`Removed picture with name ${pictureName}`);
      res.send({ message: 'Image removed from listing' });
    });
  } else {
    res.status(500).send({ message: 'Error while removing image' });
  }
});

export default router;
