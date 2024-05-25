import express from 'express';

const router = express.Router();

// logout request destroys the session
router.use('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).render('error', { message: `Logout error: ${err.message}` });
    } else {
      res.redirect('back');
    }
  });
});

export default router;
