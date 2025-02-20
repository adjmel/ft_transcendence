function profileForm() {
    document.getElementById("profile_info").classList.toggle("d-none");
    document.getElementById("profile_form").classList.toggle("d-none");
}

async function sendProfileForm() {
    formData = new FormData(document.getElementById("profile_form"));
  
    try {
        response = await fetch("http://127.0.0.1:8080/", { method: "POST", body: formData });
        console.log(await response.json());
    } catch (e) {
        console.error(e);
    }
  }