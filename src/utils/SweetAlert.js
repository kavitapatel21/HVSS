import Swal from 'sweetalert2';

export const showConfirmationDialog = (
  title,
  text,
  icon = 'warning',
  confirmButtonText = 'Yes, delete it!',
  cancelButtonText = 'No, cancel',
  reverseButtons = true,
  callback
) => {
  Swal.fire({
    title: title,
    text: text,
    icon: icon,
    showCancelButton: true,
    confirmButtonText: confirmButtonText,
    cancelButtonText: cancelButtonText,
    reverseButtons: reverseButtons,
  }).then((result) => {
    if (result.isConfirmed) {
      callback();
    }
  });
};