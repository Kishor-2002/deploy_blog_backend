const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const jwtSecret = "BLOGUSINGMERN";
// const adminLayout = '../views/layouts/admin';
// const authMiddleware = require('../middleware/authMiddleware')



router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne( { username } );

    if(!user) {
      return res.status(401).json( { message: 'Invalid credentials' } );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) {
      return res.status(401).json( { message: 'Invalid credentials' } );
    }

    const token = jwt.sign({ userId: user._id}, jwtSecret );
    //saving the token info into cookies
    res.cookie('token', token, { httpOnly: true });
    // res.redirect('/dashbsoard');
    res.status(200).json({username})
  } catch (error) {
    res.status(400).json({error:error.message+'line 36'});
  }
});



/**
 * POST /
 * Admin - Register
*/
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne( { username } );
    if(user){
      res.status(409).json({ message: 'User Already Exists'});
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const user = await User.create({ username, password:hashedPassword });
      res.status(201).json({ message: 'User Created', user });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error line 57'})
    }
    
  } catch (error) {
    res.status(400).json({error:error.message})
  }
});


/**
 * GET /
 * Admin Logout
*/
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logout successful.'});
  // res.redirect('/');
});



module.exports = router;

/**
 * 
 * Check Login
*/
// const authMiddleware = (req, res, next ) => {
  //   const token = req.cookies.token;
  
  //   if(!token) {
    //     return res.status(401).json( { message: 'Unauthorized'} );
//   }

//   try {
//     const decoded = jwt.verify(token, jwtSecret);
//     req.userId = decoded.userId;
//     next();
//   } catch(error) {
//     res.status(401).json( { message: 'Unauthorized'} );
//   }
// }


/**
 * GET /
 * Admin - Login Page
*/
// router.get('/admin', async (req, res) => {
//   try {
//     const local = {
//       title: "Admin",
//       description: "Simple Blog created with NodeJs, Express & MongoDb."
//     }

//     res.render('admin/index', { local, layout: adminLayout });
//   } catch (error) {
//     console.log(error);
//   }
// });


/**
 * POST /
 * Admin - Check Login
*/


/**
 * GET /
 * Admin Dashboard
*/
// router.get('/dashboard', authMiddleware, async (req, res) => {
//   try {
//     const local = {
//       title: 'Dashboard',
//       description: 'Simple Blog created with NodeJs, Express & MongoDb.'
//     }

//     const data = await Post.find();
//     res.render('admin/dashboard', {
//       local,
//       data,
//       layout: adminLayout
//     });

//   } catch (error) {
//     console.log(error);
//   }

// });




/**
 * POST /
 * Admin - Create New Post
*/
// router.post('/add-post', authMiddleware, async (req, res) => {
//   try {
//     try {
//       const newPost = new Post({
//         title: req.body.title,
//         body: req.body.body
//       });

//       await Post.create(newPost);
//       res.redirect('/dashboard');
//     } catch (error) {
//       console.log(error);
//     }

//   } catch (error) {
//     console.log(error);
//   }
// });


/**
 * GET /
 * Admin - Create New Post
*/
// router.get('/edit-post/:id', authMiddleware, async (req, res) => {
//   try {

//     const local = {
//       title: "Edit Post",
//       description: "Free NodeJs User Management System",
//     };

//     const data = await Post.findOne({ _id: req.params.id });

//     res.render('admin/edit-post', {
//       local,
//       data,
//       layout: adminLayout
//     })

//   } catch (error) {
//     console.log(error);
//   }

// });


/**
 * PUT /
 * Admin - Create New Post
*/
// router.put('/edit-post/:id', authMiddleware, async (req, res) => {
//   try {

//     await Post.findByIdAndUpdate(req.params.id, {
//       title: req.body.title,
//       body: req.body.body,
//       updatedAt: Date.now()
//     });

//     res.redirect(`/edit-post/${req.params.id}`);

//   } catch (error) {
//     console.log(error);
//   }

// });


// router.post('/admin', async (req, res) => {
//   try {
//     const { username, password } = req.body;
    
//     if(req.body.username === 'admin' && req.body.password === 'password') {
//       res.send('You are logged in.')
//     } else {
//       res.send('Wrong username or password');
//     }

//   } catch (error) {
//     console.log(error);
//   }
// });


