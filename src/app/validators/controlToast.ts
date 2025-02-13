import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});
export function errorToast(text: string): void {
  Toast.fire({
    icon: "error",
    text: text,
  });
}

export function successToast(text: string): void {
  Toast.fire({
    icon: "success",
    text: text,
  });
}

export function warningToast(text: string): void {
  Toast.fire({
    icon: "warning",
    text: text,
  });
}

export function errorSwal(title: string, text: string): void {
  Swal.fire({
    icon: "error",
    title: title,
    text: text,
    confirmButtonColor: "#0c734c",
    allowOutsideClick: false,
  });
}

export function successSwal(title: string, text: string): void {
  Swal.fire({
    icon: "success",
    title: title,
    text: text,
    confirmButtonColor: "#0c734c",
    allowOutsideClick: false,
  });
}

export function warningSwal(title: string, text: string): void {
  Swal.fire({
    icon: "warning",
    title: title,
    text: text,
    confirmButtonColor: "#0c734c",
    allowOutsideClick: false,
  });
}

export function warningConsultaSwal(
  title: string,
  text: string,
  confirmButton: string,
  cancelButton: string
) {
  return Swal.fire({
    title: title,
    text: text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#0c734c",
    cancelButtonColor: "#aaa",
    confirmButtonText: confirmButton,
    cancelButtonText: cancelButton,
    reverseButtons: true,
    allowOutsideClick: false,
  });
}

export function successSwalConfirmacion(title: string, text: string){
  return Swal.fire({
    icon: "success",
    title: title,
    text: text,
    confirmButtonColor: "#0c734c",
    allowOutsideClick: false,
  });
}
