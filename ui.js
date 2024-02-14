$(document).ready(function () {
  $("#aboutIcon").click(function (i, attr) {
    $("aboutGame").attr("hidden", function () {
      attr == null ? "hidden" : null;
    });
  });
});
