const postContainer = document.querySelector(".posts-container")
const postForm = document.querySelector('.post-form')
const postTitle = document.querySelector('.post-title')
const postBody = document.querySelector('.post-body')


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
           </div>
            `;
}).join("");
        postContainer.innerHTML = postsHTml;

            
        const deleteBtn = document.querySelectorAll('.delete-btn')
        deleteBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            deletePost(btn)
        })
        });
  
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
    const titlePost = postTitle.value 
    const bodyPost = postBody.value 
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
    </div>
`);
 const deleteBtns = document.querySelectorAll('.delete-btn')
  deleteBtns.forEach( btn => { 

  btn.addEventListener('click', () => {
    deletePost(btn)
  })
  })

   console.log(data)

   postTitle.value = "";
   postBody.value = "";
} catch(error){
    console.log(error)
}
})
