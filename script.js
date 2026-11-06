const postContainer = document.querySelector(".posts-container")
console.log(postContainer)

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
 
