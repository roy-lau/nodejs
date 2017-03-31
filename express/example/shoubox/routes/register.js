
/* GET register listing. */

module.exports = {
	form: function (req, res) {
		res.render('register', {title: 'Register'});
	}
}

