let users=JSON.parse(localStorage.users||"{}"),
posts=JSON.parse(localStorage.posts||"[]"),
comments=JSON.parse(localStorage.comments||"[]"),
current=localStorage.current||"";

function save(){
 localStorage.users=JSON.stringify(users);
 localStorage.posts=JSON.stringify(posts);
 localStorage.comments=JSON.stringify(comments);
}

function showRegister(){login.classList.add("hide");register.classList.remove("hide")}
function showLogin(){register.classList.add("hide");login.classList.remove("hide")}

function signup(){
 let n=rn.value.trim(),u=ru.value.trim(),p=rp.value;
 if(!n||!u||!p)return alert("Fill all fields");
 if(users[u])return alert("Username already exists");
 users[u]={name:n,password:p,followers:[],following:[]};
 save();alert("Registered");showLogin();
}

function signin(){
 let u=lu.value,p=lp.value;
 if(!users[u]||users[u].password!=p)return alert("Invalid login");
 current=u;localStorage.current=u;openApp();
}

function openApp(){
 auth.classList.add("hide");
 app.classList.remove("hide");
 home();
}

function logout(){
 localStorage.removeItem("current");
 current="";
 app.classList.add("hide");
 auth.classList.remove("hide");
}

function home(){
 let a=posts.filter(p=>p.user==current||
 users[current].following.includes(p.user))
 .sort((a,b)=>b.time-a.time);

 page.innerHTML=`<div class="card">
 <textarea id="postText" maxlength="280"
 placeholder="What's happening?"></textarea>
 <button onclick="addPost()">Post</button></div>
 <div id="feed">${a.length?a.map(postHTML).join(""):"<p>No posts yet.</p>"}</div>`;
}

function addPost(){
 let t=postText.value.trim();
 if(!t)return;
 posts.push({id:Date.now(),user:current,text:t,time:Date.now()});
 save();home();
}

function postHTML(p){
 let c=comments.filter(x=>x.post==p.id);
 return `<div class="card">
 <b>${p.user}</b><p>${p.text}</p>
 ${c.map(x=>`<div><b>${x.user}</b>: ${x.text}</div>`).join("")}
 <input id="c${p.id}" maxlength="200" placeholder="Comment">
 <button onclick="addComment(${p.id})">Comment</button></div>`;
}

function addComment(id){
 let x=document.getElementById("c"+id);
 if(!x.value.trim())return;
 comments.push({post:id,user:current,text:x.value});
 save();home();
}

function showUsers(){
 page.innerHTML="<h2>Users</h2>"+
 Object.keys(users).filter(u=>u!=current).map(userHTML).join("");
}

function userHTML(u){
 let f=users[current].following.includes(u);
 return `<div class="card">
 <b>${users[u].name}</b><p>@${u}</p>
 <p>Followers: ${users[u].followers.length} |
 Following: ${users[u].following.length}</p>
 <button onclick="follow('${u}')">${f?"Unfollow":"Follow"}</button>
 </div>`;
}

function follow(u){
 let f=users[current].following;
 if(f.includes(u)){
  users[current].following=f.filter(x=>x!=u);
  users[u].followers=users[u].followers.filter(x=>x!=current);
 }else{
  f.push(u);
  users[u].followers.push(current);
 }
 save();showUsers();
}

function showProfile(){
 let u=users[current];
 page.innerHTML=`<div class="card">
 <h2>${u.name}</h2><p>@${current}</p>
 <div class="counts">
 <span onclick="people('followers')">
 <b>${u.followers.length}</b><br>Followers</span>
 <span onclick="people('following')">
 <b>${u.following.length}</b><br>Following</span>
 </div></div>
 <h3>My Posts</h3>
 ${posts.filter(p=>p.user==current)
 .sort((a,b)=>b.time-a.time).map(postHTML).join("")}`;
}

function people(type){
 let a=users[current][type];
 page.innerHTML=`<h2>${type}</h2>`+
 (a.length?a.map(userHTML).join(""):"<p>No users.</p>");
}

if(current&&users[current])openApp();