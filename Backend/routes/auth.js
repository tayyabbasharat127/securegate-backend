const  express = require ("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { registeruser,login,loginhistory } = require ('../controller/auth.js');


router.post('/register',registeruser);
router.post('/login',login);
router.get('/history',auth,loginhistory)
module.exports = router;