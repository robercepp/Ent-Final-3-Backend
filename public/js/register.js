var fileText = document.querySelector(".filetext");
var fileItem;
var fileName;

//Funciones
async function newUser() {
  const nombre = document.getElementById("nombre").value;
  const apellido = document.getElementById("apellido").value;
  const edad = document.getElementById("edad").value;
  const direccion = document.getElementById("direccion").value;
  const telefono = phoneInput.getNumber();
  const email = document.getElementById("email").value;
  const email2 = document.getElementById("email2").value;
  const password = document.getElementById("password").value;
  const password2 = document.getElementById("password2").value;
  const admin = document.getElementById(`admin`).value;
  const file = document.querySelector(".inputFile").files[0];
  if (email !== email2) {
    console.log("Los campos de Email deben ser iguales.");
  } else if (password !== password2) {
    console.log("Las contraseñas no coinciden");
  } else {
    const formData = new FormData();
    formData.append("avatar", file, email + ".jpg");
    formData.append("nombre", nombre);
    formData.append("apellido", apellido);
    formData.append("edad", edad);
    formData.append("direccion", direccion);
    formData.append("telefono", telefono);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("admin", admin);

    Swal.fire({
      title: "Nuevo Usuario",
      text: `El usuario ${email} será creado.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "confirmar",
      cancelButtonText: "cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch("/register", {
          method: "POST",
          body: formData,
        })
          .then((response) => console.log(response.status))
          .catch((err) => console.log(err));
        Swal.fire({
          title: "Exito!",
          text: `El usuario ${email} ha sido creado.`,
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "entendido",
          footer: "será redirigido a la pagina de Login"
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/login";
          }
        });
      }
    });
  }
}

//telefónico
const phoneInputField = document.querySelector("#telefono");
const phoneInput = window.intlTelInput(phoneInputField, {
  preferredCountries: ["ar"],
  utilsScript:
    "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
});

function getFile(e) {
  fileItem = e.target.files[0];
  fileName = fileItem.name;
  fileText.innerHTML = fileName;
}
