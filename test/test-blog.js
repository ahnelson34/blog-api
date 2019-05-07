const chai = require("chai");
const chaiHttp = require("chai-http");

const { app, runServer, closeServer } = require("../server");


const expect = chai.expect;


chai.use(chaiHttp);

describe("Blog Posts", function() {

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  
  it("should list blogs on GET", function() {
    return chai
      .request(app)
      .get("/blog-posts")
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a("array");
        expect(res.body.length).to.be.at.least(0);
        
        const expectedKeys = ['title', 'content', 'author', 'id', 'publishDate'];
        res.body.forEach(function(item) {
          expect(item).to.be.a("object");
          expect(item).to.have.all.keys(expectedKeys);
        });
      });
  });

  
  it("should add a blog on POST", function() {
    const newPost = { 
        title: "Blog Title goes here",
        content: "Content goes here",
        author: "Author name goes here"
     };
     const expectedKeys = ['id', 'publishDate'].concat(Object.keys(newPost));
    return chai
      .request(app)
      .post("/blog-posts")
      .send(newPost)
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a("object");
        expect(res.body).to.have.all.keys(expectedKeys);
        expect(res.body.title).to.equal(newPost.title);
        expect(res.body.content).to.equal(newPost.content);
        expect(res.body.author).to.equal(newPost.author);
      });
  });
  
  it("should give error if POST is missing expected values", function() {
      const badPost = {};
      return chai
        .request(app)
        .post("/blog-posts")
        .send(badPost)
        .then(function(res) {
            expect(res).to.have.status(400);
        });
  });

 
  it("should update blogs on PUT", function() {

    const updatedPost = {
      title: "Updated title goes here",
      content: "Updated content goes here"
    };

    return (
      chai
        .request(app)
        
        .get("/blog-posts")
        .then(function(res) {
          updatedPost.id = res.body[0].id;
          
          return chai
            .request(app)
            .put(`/blog-posts/${updatedPost.id}`)
            .send(updatedPost)
        })
        
        .then(function(res) {
          expect(res).to.have.status(204);
        })
    );
  });

 
  it("should delete blogs on DELETE", function() {
    return (
      chai
        .request(app)
        
        .get("/blog-posts")
        .then(function(res) {
          return chai.request(app).delete(`/blog-posts/${res.body[0].id}`);
        })
        .then(function(res) {
          expect(res).to.have.status(204);
        })
    );
  });
});
