var ref = new Firebase("https://my-fbase-blog.firebaseio.com/");
var postRef = ref.child("posts");
var userName;
var templatePost = $("#posts #post:last"), currentPost;


$(document).ready(function(){
  $('#submit').on('click', submitPost);
  $("#login").on("click", function(){
    ref.authWithOAuthRedirect("google", function(error) {

      if (error) {
        console.log("Login Failed!", error);
      } else {

      }
    });
  });
  ref.onAuth(authDataCallback);
  var fbPost;

  ref.once('value', function(snapshot) {
    fbPost = snapshot.val();
    if (fbPost) {
      var lastposts = templatePost.clone().removeClass("hidden");
      console.log(snapshot.val());
      lastposts.find(".author").text(fbPost.authorName);
      lastposts.find(".time").text((new Date(fbPost.postTime)).toLocaleString());
      lastposts.find(".paragraph").text(fbPost.text);
      $("#posts").prepend(lastposts);
    }
  });
  postRef.on("child_added", function(snap) {
    postRef = snap.val();
    currentPost = templatePost.clone().removeClass("hidden");
    currentPost.find(".author").text(fbPost.authorName);
    currentPost.find(".time").text((new Date(fbPost.postTime)).toLocaleString());
    currentPost.find(".paragraph").text(fbPost.text);
    $("#posts").prepend(currentPost);
  });
});

function authDataCallback(authData) {
  if (authData) {
    userName = authData.google.displayName
    console.log("User " + authData.google.displayName + " is logged in with " + authData.provider);
    $("#login").text(authData.google.displayName + " is logged in");
  } else {
    console.log("User is logged out");
  }
}

function submitPost(post) {
  console.log('test');
  $("#user").text(post);
  var blog = $("#blogpost");
  var postBody = blog.find("textarea").val();
  console.log(postBody);
  postRef.push({
    authorName: userName,
    text: postBody,
    postTime: Firebase.ServerValue.TIMESTAMP
  });



}
