const express = require('express');
const router = express.Router();

const {BlogPosts} = require('./models');

function blogPlaceholder() {
    return (
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas id tortor sed augue elementum convallis." + 
        "Etiam efficitur metus leo. Phasellus porttitor felis vitae elit auctor mattis. Phasellus quis auctor augue. Nulla facilisi. Sed sit amet lacinia erat, sit amet sodales massa." + 
        "Etiam in tristique odio, eget scelerisque magna. Etiam hendrerit eleifend scelerisque. Nulla ut sem et lacus convallis tincidunt. Fusce accumsan vestibulum erat." +  
        "Aenean odio eros, aliquam lobortis porttitor non, molestie ac arcu. Phasellus in sodales elit."
    );
}

BlogPosts.create(
    'Blog Post 1', blogPlaceholder(), 'Alex Nelson'
);
BlogPosts.create(
    'Blog Post 2', blogPlaceholder(), 'Alex Nelson'
);

router.get('/', (req, res) => {
    res.json(BlogPosts.get());
});

router.post('/', (req, res) => {
    // ensure `name` and `budget` are in request body
    const requiredFields = ['title', 'content', 'author'];
    for (let i=0; i<requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`
        console.error(message);
        return res.status(400).send(message);
      }
    }
    const item = BlogPosts.create(req.body.title, req.body.content, req.body.author);
    res.status(201).json(item);
  });

router.put('/:id', (req, res) => {
    const requiredFields = ['title', 'content', 'author', 'publishDate', 'id'];
    for (let i=0; i<requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`
        console.error(message);
        return res.status(400).send(message);
      }
    }
    if (req.params.id !== req.body.id) {
      const message = (
        `Request path id (${req.params.id}) and request body id `
        `(${req.body.id}) must match`);
      console.error(message);
      return res.status(400).send(message);
    }
    console.log(`Updating blog post \`${req.params.id}\``);
    const updatedItem = Recipes.update({
      id: req.params.id,
      title: req.body.title,
      contnet: req.body.content,
      author: req.body.author,
      publishDate: req.body.publishDate
    });
    res.status(204).end();
});

router.delete('/:id', (req, res) => {
    Recipes.delete(req.params.id);
    console.log(`Deleted blog post \`${req.params.ID}\``);
    res.status(204).end();
  });

module.exports = router;