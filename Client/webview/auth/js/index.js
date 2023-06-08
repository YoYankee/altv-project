const loginInputType = document.querySelector(".login-password-btn");
const regInputType = document.querySelector(".reg-password-btn");

loginInputType.addEventListener("click",function(){
    if(document.querySelector("#passwordInput").type === "password") document.querySelector("#passwordInput").type = "text";
    else document.querySelector("#passwordInput").type = "password";
});

regInputType.addEventListener("click",function(){
    if(document.querySelector("#regPasswordInput").type === "password") document.querySelector("#regPasswordInput").type = "text";
    else document.querySelector("#regPasswordInput").type = "password";
});

const toggleReg = document.querySelector("#toggle-reg"); // 切换至注册
const toggleLogin = document.querySelector("#toggle-login"); // 切换至登录
const loginForm = document.querySelector("#login-form"); // 登录窗口
const registerForm = document.querySelector("#reg-form"); // 注册窗口
const formTitle = document.querySelector("#form-title"); // 窗口标题

toggleReg.addEventListener("click", function() {
    loginForm.style.display = "none";
    registerForm.style.display = "block";
    formTitle.textContent = "注册窗口";
    toggleLogin.textContent = "返回登录";
});

toggleLogin.addEventListener("click", function() {
    loginForm.style.display = "block";
    registerForm.style.display = "none";
    formTitle.textContent = "登录窗口";
    toggleReg.textContent = "创建一个账号";
});

const loginUser = document.querySelector('#usernameInput');
const loginPassword = document.querySelector('#passwordInput');
const loginButton = document.querySelector('.login-button');

loginButton.addEventListener("click", function() {
    if (loginUser != null && loginPassword != null) {
        alt.emit('auth:client:tryLogin', loginUser.value, loginPassword.value);
        console.log("发送登录请求");
    }
});
