const postContainer = document.querySelector(".posts-container")
const postForm = document.querySelector('.post-form')
const postTitle = document.querySelector('.post-title')
const postBody = document.querySelector('.post-body')
const errorMessage = document.querySelector('.error-message')


let editingPostElement = null;
let editingPostId = null;

async function loadPosts(){
    try{
        const response = await fetch("https://dummyjson.com/posts");
        if(!response.ok){
            throw new Error ("something went to wrong")
        } 
        const data = await response.json();
        console.log(data)

        
    const postsHTml =   data.posts.map(post => {
        return  `
           <div class="post">
             <h3>${post.title}</h3>
             <p>${post.body}</p>
             <button class="delete-btn" data-id="${post.id}">
                Delete
             </button>
             <button class="edit-btn" data-id="${post.id}">
    edit
</button>
           </div>
            `;
}).join("");
        postContainer.innerHTML = postsHTml;

            
       
  
    } catch(error){
      console.log(error)
    }
    
}
loadPosts()

async function deletePost(btn){
    if(btn.dataset.local === "true"){
    btn.closest(".post").remove();
    return;
}
    const itemId = btn.dataset.id;
 try{
    const response = await fetch(`https://dummyjson.com/posts/${itemId}`, {
    method: "DELETE"
   });
        if(!response.ok){
            throw new Error ("something went to wrong")
        } 
        const data = await response.json();
        console.log(data)
        btn.closest(".post").remove();
    } catch(error){
        console.log(error)
    }
}
 
postForm.addEventListener('submit', async (event) => {
    event.preventDefault();
        const titlePost = postTitle.value.trim(); 
    const bodyPost = postBody.value.trim();
      if (titlePost === "") {
    errorMessage.textContent = "Please enter a title";
    return;
}  
      if (bodyPost === "") {
    errorMessage.textContent = "Please enter a text";
    
    return;
}
  errorMessage.textContent = "";
  
        
   if (editingPostId !== null) {
    if (editingPostElement.querySelector(".edit-btn").dataset.local === "true") {
    editingPostElement.querySelector("h3").textContent = titlePost;
editingPostElement.querySelector("p").textContent = bodyPost;
} else {
    


        const updatedPost = {
    title: titlePost,
    body: bodyPost,
    userId: 1
};
 try{
    const response = await fetch(`https://dummyjson.com/posts/${editingPostId}`, {
        method: "PUT",
        headers:{
            "content-Type": "application/json"
        },
        body: JSON.stringify(updatedPost)
    })  
     if(!response.ok){
        throw new Error("something went to wrong")
     }
     const data = await response.json();
     console.log(data)
     editingPostElement.querySelector("h3").textContent = data.title;
editingPostElement.querySelector("p").textContent = data.body;
    editingPostId = null;
editingPostElement = null;
postTitle.value = "";
postBody.value = "";
    } catch(error){
        console.log(error)
     }
} 

} 
 
else{ 
  

  
    const latestPost = {
       title: titlePost,
       body: bodyPost,
       userId: 1
    }
    try{ 
    const response = await fetch("https://dummyjson.com/posts/add", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(latestPost)
});
   if(!response.ok){
    throw new Error ("something went to wrong")
   }
   const data = await response.json()
   
   postContainer.insertAdjacentHTML("afterbegin", `
    <div class="post">
        <h3>${data.title}</h3>
        <p>${data.body}</p>
        <button class="delete-btn" data-id="${data.id}" data-local="true">
            Delete
        </button>
        <button class="edit-btn" data-id="${data.id}" data-local="true">
            edit
        </button>
    </div>
`);


   console.log(data)

   postTitle.value = "";
   postBody.value = "";
 
     
} catch(error){
    console.log(error)
} }
} )


postContainer.addEventListener("click", (event) => {
 const btn = event.target.closest(".delete-btn");


if (btn) {
    deletePost(btn);
}
 const edit = event.target.closest(".edit-btn");
 
  if(edit){
    editingPostId = edit.dataset.id;
      editingPostElement = edit.closest(".post");

    const title = editingPostElement.querySelector("h3").textContent ;
    const body = editingPostElement.querySelector("p").textContent ;

    postTitle.value = title;
   postBody.value = body;


  }
    
 
  
 
});
