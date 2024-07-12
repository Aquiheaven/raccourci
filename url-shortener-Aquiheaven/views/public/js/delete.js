// // const deleteButton = document.getElementById("delete");

// // deleteButton.addEventListener("click", async (event) => {
// //   const confirmation = confirm("Voulez-vous supprimer cet article?");

// //   if (confirmation) {
    
// //     const slug = event.target.name;
    

// //     try {
// //       const response = await fetch(`/articles/${slug}`, { method: "DELETE" });
// //       if (response.ok) {
// //         window.location.href = "/articles";
// //       } else {
// //         console.error("erreur de la suppression");
// //       }
// //     } catch (error) {
// //       console.error("erreur reseaux:", error);
// //     }
// //   }
// // });

// document.querySelectorAll('form[action="/delete"]').forEach(form => {
//   form.addEventListener('submit', function(event) {
//       if (!confirm('Are you sure you want to delete this URL?')) {
//           event.preventDefault(); 
//       }
//   });
// });

document.addEventListener("DOMContentLoaded", function() {
  const deleteButtons = document.querySelectorAll(".delete-button");

  deleteButtons.forEach(button => {
      button.addEventListener("click", function(event) {
          event.preventDefault();
          const urlId = this.dataset.id;

          fetch(`/supprimer/${urlId}`, {
              method: "DELETE"
          })
          .then(response => response.json())
          .then(data => {
              if (data.success) {
                  window.location.reload();
              } else {
                  alert("Erreur lors de la suppression de l'URL.");
              }
          })
          .catch(error => {
              console.error("Erreur:", error);
              alert("Erreur lors de la suppression de l'URL.");
          });
      });
  });
});

// document.addEventListener('DOMContentLoaded', () => {
//   const deleteButtons = document.querySelectorAll('.delete-button');

//   deleteButtons.forEach(button => {
//       button.addEventListener('click', async (e) => {
//           const id = e.target.getAttribute('data-id');

//           const response = await fetch(`/supprimer/${id}`, {
//               method: 'DELETE',
//           });

//           const result = await response.json();

//           if (result.success) {
//               alert('URL supprimée avec succès');
//               location.reload();
//           } else {
//               alert('Erreur lors de la suppression de l\'URL');
//           }
//       });
//   });
// });

// document.addEventListener('DOMContentLoaded', function() {
//   const deleteButtons = document.querySelectorAll('.delete-button');
  
//   deleteButtons.forEach(button => {
//       button.addEventListener('click', function() {
//           const id = button.getAttribute('data-id');
          
//           fetch(`/supprimer/${id}`, {
//               method: 'DELETE',
//           })
//           .then(response => response.json())
//           .then(data => {
//               if (data.success) {
//                   // Suppression réussie, recharger la page
//                   location.reload();
//               } else {
//                   // Afficher un message d'erreur si la suppression échoue
//                   alert(data.message);
//               }
//           })
//           .catch(error => {
//               console.error('Erreur lors de la suppression:', error);
//           });
//       });
//   });
// });
