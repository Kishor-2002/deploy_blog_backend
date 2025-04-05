const express = require('express')
const router = express.Router();
const Post = require('../models/post');
const authMiddleware = require('../middleware/authMiddleware')
const mongoose = require('mongoose')

router.use(authMiddleware)
// Routes
router.get('/',async(req,res)=>{
    try{
        // const local = {
        //     title:"News Blog",
        //     description:"Blogpagefor news"
        // }
        // let perPage = 10;
        // let page = req.query.page || 1;

        // const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
        // .skip(perPage * page - perPage)
        // .limit(perPage)
        // .exec();

        // // Count is deprecated - please use countDocuments
        // // const count = await Post.count();
        // const count = await Post.countDocuments({});
        // const nextPage = parseInt(page) + 1;
        // const hasNextPage = nextPage <= Math.ceil(count / perPage);


    
        //  res.render('index', { 
        //     local,
        //     data,
        //     current: page,
        //     nextPage: hasNextPage ? nextPage : null,
        //     currentRoute: '/'
        // });
        const posts = await Post.aggregate([ { $sort: { createdAt: -1 } } ]);
        res.status(200).json(posts)
    }catch(error){
        res.status(404).json(error.message)
    }
})


// router.get('', async (req, res) => {
//   const locals = {
//     title: "NodeJs Blog",
//     description: "Simple Blog created with NodeJs, Express & MongoDb."
//   }

//   try {
//     const data = await Post.find();
//     res.render('index', { locals, data });
//   } catch (error) {
//     console.log(error);
//   }

// });


/**
 * GET /
 * Post :id
*/
router.get('/post/:id', async (req, res) => {
  try {
    let postId = req.params.id;

    const data = await Post.findById({ _id: postId });

    // const local = {
    //   title: data.title,
    //   description: "Simple Blog created with NodeJs, Express & MongoDb.",
    // }

    // res.render('post', { 
    //   local,
    //   data,
    //   currentRoute: `/post/${slug}`
    // });
    res.status(200).json(data)
  } catch (error) {
    console.log(error);
  }
});


/**
 * POST /
 * Post - searchTerm
*/
router.post('/search', async (req, res) => {
  try {
    const local = {
      title: "Seach",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
        { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
      ]
    });

    //rendering search psage with these parameters
    // res.render("search", {
    //   data,
    //   local,
    //   currentRoute: '/'
    // });
    res.status(200).json(data)
    
  } catch (error) {
    console.log(error);
  }

});


/**
 * GET /
 * Admin - Create New Post
*/
router.put('/add-post', authMiddleware, async (req, res) => {
  const {title,body} = req.body;
  let emptyFields = [];
  if(!title){
    emptyFields.push("title")
  }
  if(!body){
    emptyFields.push("body")
  }

  if(emptyFields.length>0){
    return res.status(400).json({error:"Please fill in all the fields",emptyFields})
  }

  try{

    const post = await Post.create({title,body});
    res.status(200).json(post);
  }catch (err){
    res.status(400).json({error:err.message})
  }

  // try {
  //   const local = {
  //     title: 'Add Post',
  //     description: 'Simple Blog created with NodeJs, Express & MongoDb.'
  //   }

  //   const data = await Post.find();
  //   res.render('admin/add-post', {
  //     local,
  //     layout: adminLayout
  //   });
    
  // } catch (error) {
  //   console.log(error);
  // }
  
});


/**
 * GET /
 * Admin - Create New Post
*/
router.patch('/edit-post/:id', authMiddleware, async (req, res) => {
  // try {
    
    // const local = {
    //   title: "Edit Post",
    //   description: "Free NodeJs User Management System",
    // };
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:'No such Post'})
    }

    const posts = await Post.findOneAndUpdate({_id : id},{
        ...req.body
    })
    if(!posts){
        return res.status(404).json({error:'No such Post'})
    }
    const data = await Post.findById({ _id: id });
    res.status(200).json(data)

  //   const data = await Post.findOne({ _id: req.params.id });
    
  //   res.render('admin/edit-post', {
  //     local,
  //     data,
  //     layout: adminLayout
  //   })
    
  // } catch (error) {
  //   console.log(error);
  // }
  
});


/**
 * DELETE /
 * Admin - Delete Post
*/
router.delete('/delete-post/:id', authMiddleware, async (req, res) => {

  const {id} = req.params;
  const response = await Post.deleteOne( { _id: id} );
  if(!response){
    return res.status(404).json({error:'No such Post'})
  }
  res.status(200).json({message : `post with Id ${id} is deleted`})
  // try {
  //   await Post.deleteOne( { _id: req.params.id } );
  //   res.redirect('/dashboard');
  // } catch (error) {
  //   console.log(error);
  // }

});


router.get('/about', (req, res) => {
  res.render('about', {
    currentRoute: '/about'
  });
});


module.exports=router


// function insertPostData () {
//   Post.insertMany([
//     {
//       title: "Building APIs with Node.js",
//       body: "Learn how to use Node.js to build RESTful APIs using frameworks like Express.js"
//     },
//     {
//       title: "Deployment of Node.js applications",
//       body: "Understand the different ways to deploy your Node.js applications, including on-premises, cloud, and container environments..."
//     },
//     {
//       title: "Authentication and Authorization in Node.js",
//       body: "Learn how to add authentication and authorization to your Node.js web applications using Passport.js or other authentication libraries."
//     },
//     {
//       title: "Understand how to work with MongoDB and Mongoose",
//       body: "Understand how to work with MongoDB and Mongoose, an Object Data Modeling (ODM) library, in Node.js applications."
//     },
//     {
//       title: "build real-time, event-driven applications in Node.js",
//       body: "Socket.io: Learn how to use Socket.io to build real-time, event-driven applications in Node.js."
//     },
//     {
//       title: "Discover how to use Express.js",
//       body: "Discover how to use Express.js, a popular Node.js web framework, to build web applications."
//     },
//     {
//       title: "Asynchronous Programming with Node.js",
//       body: "Asynchronous Programming with Node.js: Explore the asynchronous nature of Node.js and how it allows for non-blocking I/O operations."
//     },
//     {
//       title: "Learn the basics of Node.js and its architecture",
//       body: "Learn the basics of Node.js and its architecture, how it works, and why it is popular among developers."
//     },
//     {
//       title: "NodeJs Limiting Network Traffic",
//       body: "Learn how to limit netowrk traffic."
//     },
//     {
//       title: "Learn Morgan - HTTP Request logger for NodeJs",
//       body: "Learn Morgan."
//     },
//   ])
// }

// insertPostData();
