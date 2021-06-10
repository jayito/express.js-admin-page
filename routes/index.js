const express = require('express');
const router = express.Router();
const { check, validationResult, body } = require('express-validator/check');
const paginate = require('express-paginate');
const UserController = require('../controllers/UsersController');

router.get('/', (req, res, next) => {
	return res.render('index.ejs');
});

router.get('/register', (req, res, next) => {
	return res.render('register.ejs');
});

router.post('/register', [
	check('username', 'Username must be greater than 4 chars').isLength({ min: 4 }),
	check('password', 'Password must be greater than 4 chars').isLength({ min: 4 }),
  check('confirmPassword', 'Password confirmation does not match password').custom((value, { req }) => {
    if (req.body.password && req.body.password.length >= 1 && value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    } else {
      return true;
    }
  })
], (req, res) => {
	const user = new UserController();
  const errors = validationResult(req);
	const { username, password } = req.body;
	if (!errors.isEmpty()) {
		console.log('error');
		res.send({ "Success": "password is not matched" });
	} else {
		user.createUser({ username, password })
      .then(() => {
        res.redirect('/login');
      }, error => {
				console.log('error2');
        res.redirect('/login');
      });
	}
});

router.get('/login', (req, res, next) => {
	return res.render('index.ejs');
});

router.post('/login', [
	check('username', 'Username must be greater than 4 chars').isLength({ min: 4 }),
  check('password', 'Password must be greater than 4 chars').isLength({ min: 4 })
], (req, res) => {
	const errors = validationResult(req);
  const userName = req.body.username || null;
  const passWord = req.body.password || null;
	if (!errors.isEmpty()) {
    return res.render('users/login', util.ResponseUtil.buildDefaultRenderParams(req, res, { layout: 'login', errors: errors.array(), form: { userName: userName } }));
  }

	if (userName && passWord) {
    const user = new UserController();
    user.verifyUser(userName, passWord)
      .then(
        (user) => {
          req.session.loggedIn = true;
          req.session.userName = user.username;
					return res.redirect('/dashboard');
        },
        () => res.redirect('/')
      );
  }
});

router.get('/dashboard', (req, res, next) => {
  const user = new UserController();
	if (req.session.userName) {
		return res.render('dashboard.ejs', { "name": data.username, "email": data.email });
	} else {
    return res.redirect('/logout');
  }
});

router.get('/logout', (req, res, next) => {
  if (req.session && req.session.loggedIn) {
		req.session.destroy((err) => {
			if (err) {
				return next(err);
			}
		});
  }

	return res.redirect('/');
});

router.get('/forgetpass', (req, res, next) => {
	res.render("forget.ejs");
});

router.post('/forgetpass', (req, res, next) => {
	//console.log('req.body');
	//console.log(req.body);
	User.findOne({ email: req.body.email }, (err, data) => {
		console.log(data);
		if (!data) {
			res.send({ "Success": "This Email Is not regestered!" });
		} else {
			// res.send({"Success":"Success!"});
			if (req.body.password == req.body.passwordConf) {
				data.password = req.body.password;
				data.passwordConf = req.body.passwordConf;

				data.save((err, Person) => {
					if (err)
						console.log(err);
					else
						console.log('Success');
					res.send({ "Success": "Password changed!" });
				});
			} else {
				res.send({ "Success": "Password does not matched! Both Password should be same." });
			}
		}
	});

});

module.exports = router;