const router = express.router();
import {auth} from '../controller/auth';
import {loginevent} from '../controller/loginevent';
router.post('/register',auth);
router.post('/login',auth);
module.exports = router;