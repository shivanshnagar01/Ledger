const supaUrl = "https://jfkzlnhlstdzdoytbfsd.supabase.co";
const supaKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impma3psbmhsc3RkemRveXRiZnNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5NTA2MjAsImV4cCI6MjEwNDUyNjYyMH0.QvP411ch-8IFIYnlh615dcpBbAy_gGc5tzFOOhSs7rM";

const database = window.supabase.createClient(
  supaUrl,
  supaKey
);


const usertitle = document.querySelector(".utile")
const usernameInput = document.querySelector("#username");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const signupBtn = document.querySelector("#next");
const togglebtn = document.querySelector(".toggle")

const nameofpro = document.querySelector(".process-name")

const nextbnt = document.querySelector(".next")

const optional = document.querySelector(".opt")
const togline = document.querySelector(".haveacc")

let authMode = "Signup";

togline.addEventListener("click", () => {
  if (togline.innerHTML === `Have an account?<span class="toggle"> Login</span>`) {
    togline.innerHTML = `Don't have an account?<span class="toggle"> Sign up</span>`
    nameofpro.innerText = "Login"
    authMode = "login"
    nextbnt.innerText = "Login"
    // optional.style.opacity = 0.8
    usernameInput.style.opacity = 0.3
    usernameInput.disabled = true
    usertitle.style.opacity = 0.3
    
  }
  else if (togline.innerHTML === `Don't have an account?<span class="toggle"> Sign up</span>`) {
    togline.innerHTML = `Have an account?<span class="toggle"> Login</span>`
    nameofpro.innerText = "Sign Up"
    nextbnt.innerText = "Sign Up"
    authMode = "Signup"
    usernameInput.style.opacity = 1
    usertitle.style.opacity = 1
    optional.style.opacity = 0
  }

  console.log(authMode)
})


async function signUp() {
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    const { data, error } = await database.auth.signUp({
        email: email,
        password: password
    });

    // Signup failed
    if (error) {
        console.log(error.message);
        return;
    }

    const user = data.user;

    const { data: profileData, error: profileError } =
        await database
            .from("profiles")
            .insert({
                id: user.id,
                username: username,
                email: email
            });

    console.log("profile data:", profileData);
    console.log("profile error:", profileError);

    // Profile creation failed
    if (profileError) {
        console.log(profileError.message);
        return;
    }

    window.location.href = "dash.html";
}


async function signInWithPassword() {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    const { data, error } =
        await database.auth.signInWithPassword({
            email: email,
            password: password
        });

    // Login failed
    if (error) {
        console.log(error.message);
        return;
    }

    console.log(data);

    window.location.href = "dash.html";
}


signupBtn.addEventListener("click", async () => {

    if (authMode === "Signup") {
        await signUp();
        
    } else if (authMode === "login") {
        await signInWithPassword();
    }
console.log(authMode)
});