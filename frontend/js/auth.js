const form = document.getElementById("loginForm");

form.addEventListener("submit", async function(e){

    e.preventDefault();

    const username=document.getElementById("username").value;
    const password=document.getElementById("password").value;

    const response=await fetch(`${API_BASE_URL}/login/`,{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({
            username,
            password
        })

    });

    const data=await response.json();

    if(response.ok){

        localStorage.setItem("token",data.token);

        localStorage.setItem("username",data.username);

        window.location="dashboard.html";

    }else{

        document.getElementById("message").innerHTML=data.error;

    }

});