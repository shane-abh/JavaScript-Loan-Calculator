
/* Name: Shane Abraham
ID: 8895137 */

"use strict";

$(document).ready(() => {
  const slider = $("#image_list"); // slider = ul element
  let leftProperty = 0;
  let newLeftProperty = 0;

  // the click event handler for the right button
  $("#right_button").click(() => {
    // get value of current left property
    leftProperty = parseInt(slider.css("left"));

    // determine new value of left property
    if (leftProperty - 300 <= -600) {
      newLeftProperty = 0;
    } else {
      newLeftProperty = leftProperty - 200;
    }

    // use the animate function to change the left property
    slider.animate(
      {
        left: newLeftProperty,
      },
      500
    );
  }); // end click

  // the click event handler for the left button
  $("#left_button").click(() => {
    // get value of current right property
    leftProperty = parseInt(slider.css("left"));

    // determine new value of left property
    if (leftProperty < 0) {
      newLeftProperty = leftProperty + 200;
    } else {
      newLeftProperty = 0;
    }

    // use the animate function to change the left property
    slider.animate(
      {
        left: newLeftProperty,
      },
      500
    );
  }); 

  // event handler while image is clicked
  $("#image_list a").click((evt) => {
    const link = evt.currentTarget;
    //getting current image element
    const currentImage = $("#image");

    //  fade out and slide left animation
    currentImage.animate(
      {
        opacity: 0,
        marginLeft: "-=200px",
      },
      1000,
      function () {
        // We use the callback function to set URL for the new image and reverse animation
        currentImage.attr("src", link.href);
        currentImage.css({
          opacity: 0,
          marginLeft: "+=410px", // Double the slide distance for the new image
        });

        // fade in and slide right animation
        currentImage.animate(
          {
            opacity: 1,
            marginLeft: "-=205px",
          },
          1000
        );
      }
    );

    evt.preventDefault();
  });
}); 
